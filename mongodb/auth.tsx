// https://github.com/mongodb-university/realm-tutorial-react-native/blob/final/providers/AuthProvider.js

import React, {
  useContext,
  useState,
  type ReactNode,
  createContext,
  useEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Realm, { type User } from "realm";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import config from "react-native-config";

import app from "./app";
import { useDB } from "./db";
import {
  loadReviewedClasses,
  loadSettings,
  loadStarredClasses,
} from "../redux/actions";

GoogleSignin.configure({
  webClientId: config.GOOGLE_WEB_CLIENT_ID,
  iosClientId: config.GOOGLE_IOS_CLIENT_ID,
});

type AuthContext = {
  user: User | null;
  username: string | null;
  isAuthenticated: boolean;
  updateUsername: (username: string) => Promise<void>;
  continueWithGoogle: () => Promise<void>;
  signInAnonymously: (override?: boolean) => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  signOut: (signInAnonymouslyAgain?: boolean) => Promise<void>;
};

type AuthProviderProps = { children: ReactNode };

const Context = createContext<AuthContext | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(app.currentUser);
  const [username, setUsername] = useState<string | null>(null);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const isAuthenticated = !!user && user.providerType !== "anon-user";

  const loadUserDoc = async (user: User) => {
    if (user.providerType === "anon-user") return;

    const userDoc = await useDB(user).loadUserDoc();

    if (userDoc) {
      const { username, starredClasses, reviewedClasses, settings } = userDoc;
      setUsername(username);
      loadStarredClasses(dispatch)(starredClasses);
      loadReviewedClasses(dispatch)(reviewedClasses);
      loadSettings(dispatch)(settings);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUserDoc(user);
    } else {
      signInAnonymously();
    }
  }, []);

  const updateUsername = async (username: string) => {
    if (!isAuthenticated) return;

    setUsername(username);
    await useDB(user).updateUsername(username);
  };

  const signInAnonymously = async (override: boolean = false) => {
    if (isAuthenticated && !override) return;

    const credentials = Realm.Credentials.anonymous();
    const newUser = await app.logIn(credentials);
    setUser(newUser);
  };

  // The signIn function takes an email and password and uses the
  // emailPassword authentication provider to log in.
  const signInWithEmailPassword = async (email: string, password: string) => {
    if (user && user.providerType === "anon-user") await signOut(false);

    const credentials = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(credentials);
    await loadUserDoc(newUser);
    setUser(newUser);
  };

  // The signUp function takes an email and password and uses the
  // emailPassword authentication provider to register the user.
  const signUpWithEmailPassword = async (
    username: string,
    email: string,
    password: string
  ) => {
    if (user && user.providerType === "anon-user") await signOut(false);

    await app.emailPasswordAuth.registerUser({ email, password });
    setUsername(username);
    const credentials = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(credentials);
    await useDB(newUser).createUserDoc(username, settings);
    setUser(newUser);
  };

  const continueWithGoogle = async () => {
    if (user && user.providerType === "anon-user") await signOut(false);

    await GoogleSignin.hasPlayServices();

    const googleUser = await GoogleSignin.signIn();
    const newUsername =
      googleUser.user.name || googleUser.user.givenName || "New User";

    // use Google ID token to sign into Realm
    const credential = Realm.Credentials.google(googleUser.idToken!);
    const newUser = await app.logIn(credential);
    const upserted = await useDB(newUser).createUserDoc(newUsername, settings);

    if (upserted) {
      setUsername(newUsername);
    } else {
      await loadUserDoc(newUser);
    }

    setUser(newUser);
  };

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = async (signInAnonymouslyAgain: boolean = true) => {
    if (user === null) {
      console.warn("Not logged in, can't log out!");
      return;
    }

    if (user.providerType === "anon-user") await app.deleteUser(user);

    await user.logOut();
    loadStarredClasses(dispatch)({});
    loadReviewedClasses(dispatch)({});
    setUser(null);

    if (signInAnonymouslyAgain) {
      await signInAnonymously(true);
    }
  };

  return (
    <Context.Provider
      value={{
        user,
        username,
        isAuthenticated,
        updateUsername,
        continueWithGoogle,
        signInAnonymously,
        signInWithEmailPassword,
        signUpWithEmailPassword,
        signOut,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// The useAuth hook can be used by components under an AuthProvider to
// access the auth context value.
const useAuth = () => {
  const auth = useContext(Context);
  if (auth === null) {
    throw new Error("useAuth() called outside of a AuthProvider?");
  }
  return auth;
};

export { AuthProvider, useAuth };
