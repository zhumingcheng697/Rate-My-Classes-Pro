import React, {
  useContext,
  useState,
  type ReactNode,
  createContext,
  useEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Realm, { type User } from "realm";

import app from "./app";
import { useDB } from "./db";
import { loadSettings, loadStarredClasses } from "../redux/actions";

type AuthContext = {
  user: User | null;
  username: string | null;
  isAuthenticated: boolean;
  updateUsername: (username: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
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
  const [user, setUser] = useState(app.currentUser);
  const [username, setUsername] = useState<string | null>(null);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const isAuthenticated = !!user && user.providerType !== "anon-user";

  const loadUserDoc = async (user: User) => {
    if (user.providerType === "anon-user") return;

    const userDoc = await useDB(user).loadUserDoc();

    if (userDoc) {
      const { username, starredClasses, settings } = userDoc;
      setUsername(username);
      loadStarredClasses(dispatch)(starredClasses);
      loadSettings(dispatch)(settings);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUserDoc(user);
    }
  }, []);

  const updateUsername = async (username: string) => {
    if (!isAuthenticated) return;

    setUsername(username);
    await useDB(user).updateUsername(username);
  };

  const signInAnonymously = async () => {
    if (isAuthenticated) return;

    setUsername(null);
    const credentials = Realm.Credentials.anonymous();
    const newUser = await app.logIn(credentials);
    setUser(newUser);
  };

  // The signIn function takes an email and password and uses the
  // emailPassword authentication provider to log in.
  const signInWithEmailPassword = async (email: string, password: string) => {
    if (user && user.providerType === "anon-user") await signOut();

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
    if (user && user.providerType === "anon-user") await signOut();

    await app.emailPasswordAuth.registerUser({ email, password });
    setUsername(username);
    const credentials = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(credentials);
    await useDB(newUser).createUserDoc(username, settings);
    setUser(newUser);
  };

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = async () => {
    if (user === null) {
      console.warn("Not logged in, can't log out!");
      return;
    }

    if (user.providerType === "anon-user") await app.deleteUser(user);

    await user.logOut();
    setUser(null);
  };

  return (
    <Context.Provider
      value={{
        user,
        username,
        isAuthenticated,
        updateUsername,
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
