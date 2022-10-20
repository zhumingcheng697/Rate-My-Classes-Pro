// https://github.com/mongodb-university/realm-tutorial-react-native/blob/final/providers/AuthProvider.js

import React, {
  useContext,
  useState,
  type ReactNode,
  createContext,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Realm from "./Realm";

import realmApp from "./realmApp";
import Database from "./db";
import {
  loadReviewedClasses,
  loadSettings,
  loadStarredClasses,
} from "../redux/actions";

type AuthContext = {
  db: Database | null;
  user: Realm.User | null;
  username: string | null;
  isSettingsSettled: boolean;
  isUserDocLoaded: boolean;
  isAuthenticated: boolean;
  fetchUserDoc: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  continueWithGoogle: (idToken: string, username: string) => Promise<void>;
  signInAnonymously: (override?: boolean) => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = { children: ReactNode };

const Context = createContext<AuthContext | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(realmApp.currentUser);
  const [isSettingsSettled, setIsSettingsSettled] = useState(false);
  const [isUserDocLoaded, setIsUserDocLoaded] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const [db, setDB] = useState<Database | null>(() =>
    user ? new Database(user) : null
  );

  const isAuthenticated = !!user && user.providerType !== "anon-user";

  const loadUserDoc = async (user: Realm.User, db: Database) => {
    if (user.providerType === "anon-user") return;

    try {
      setIsSettingsSettled(false);
      setIsUserDocLoaded(false);

      const userDoc = await db.loadUserDoc();

      if (userDoc) {
        const { username, starredClasses, reviewedClasses, settings } = userDoc;
        setUsername(username);
        loadStarredClasses(dispatch)(starredClasses);
        loadReviewedClasses(dispatch)(reviewedClasses);
        loadSettings(dispatch)(settings);
      }

      setIsUserDocLoaded(true);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setIsSettingsSettled(true);
    }
  };

  const guardDB = (user: Realm.User) => {
    let currDB = db;
    if (!currDB) {
      currDB = new Database(user);
    }
    setDB(currDB);
    return currDB;
  };

  const fetchUserDoc = async () => {
    if (user && isAuthenticated) {
      if (!isUserDocLoaded) {
        await loadUserDoc(user, guardDB(user));
      }
    } else {
      setIsUserDocLoaded(true);
      setIsSettingsSettled(true);
    }
  };

  const updateUsername = async (username: string) => {
    if (!isAuthenticated) return;

    setUsername(username);
    await guardDB(user).updateUsername(username);
  };

  const signInAnonymously = async (override: boolean = false) => {
    if (user && !override) return;

    const credentials = Realm.Credentials.anonymous();
    const newUser = await realmApp.logIn(credentials);
    setUser(newUser);
    setDB(new Database(newUser));
  };

  // The signIn function takes an email and password and uses the
  // emailPassword authentication provider to log in.
  const signInWithEmailPassword = async (email: string, password: string) => {
    if (user) await signOut();

    const credentials = Realm.Credentials.emailPassword(email, password);
    const newUser = await realmApp.logIn(credentials);
    const newDB = new Database(newUser);
    await loadUserDoc(newUser, newDB);
    setUser(newUser);
    setDB(newDB);
  };

  // The signUp function takes an email and password and uses the
  // emailPassword authentication provider to register the user.
  const signUpWithEmailPassword = async (
    username: string,
    email: string,
    password: string
  ) => {
    if (user) await signOut();

    await realmApp.emailPasswordAuth.registerUser({ email, password });
    setUsername(username);
    const credentials = Realm.Credentials.emailPassword(email, password);
    const newUser = await realmApp.logIn(credentials);
    const newDB = new Database(newUser);
    await newDB.createUserDoc(username, settings);
    setUser(newUser);
    setDB(newDB);
  };

  const continueWithGoogle = async (idToken: string, username: string) => {
    if (user) await signOut();

    // use Google ID token to sign into Realm
    const credential = Realm.Credentials.google(idToken);
    const newUser = await realmApp.logIn(credential);
    const newDB = new Database(newUser);
    const upserted = await newDB.createUserDoc(username, settings);

    if (upserted) {
      setUsername(username);
    } else {
      await loadUserDoc(newUser, newDB);
    }

    setUser(newUser);
    setDB(newDB);
  };

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = async () => {
    if (user === null) {
      console.warn("Not logged in, can't log out!");
      return;
    }

    if (user.providerType === "anon-user") await realmApp.deleteUser(user);

    await user.logOut();
    loadStarredClasses(dispatch)({});
    loadReviewedClasses(dispatch)({});
    setUser(null);
    setDB(null);
  };

  return (
    <Context.Provider
      value={{
        db,
        user,
        username,
        isSettingsSettled,
        isUserDocLoaded,
        isAuthenticated,
        fetchUserDoc,
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
