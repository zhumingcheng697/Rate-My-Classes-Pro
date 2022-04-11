import React, {
  useContext,
  useState,
  type ReactNode,
  createContext,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Realm, { type User } from "realm";

import app from "./app";
import { useDB } from "./db";
import Semester from "../libs/semester";
import { loadSettings, loadStarredClasses } from "../redux/actions";

type AuthContext = {
  user: User | null;
  username: string | null;
  isAuthenticated: boolean;
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
  const [isLoaded, setIsLoaded] = useState(false);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const isAuthenticated = !!user && user.providerType !== "anon-user";

  const loadUserDoc = async (user: User) => {
    const userDoc = await useDB(user).loadUserDoc();

    if (userDoc) {
      const { username, starredClasses, settings } = userDoc;
      const { selectedSemester, showPreviousSemesters } = settings;
      const { semester, year } = selectedSemester;
      setUsername(username);
      loadStarredClasses(dispatch)(starredClasses);
      loadSettings(dispatch)({
        selectedSemester: new Semester(semester, year),
        showPreviousSemesters,
      });
    }
  };

  if (!isLoaded) {
    if (user) {
      loadUserDoc(user);
    }
    setIsLoaded(true);
  }

  const signInAnonymously = async () => {
    if (isAuthenticated) return;

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
    setUser(newUser);
    await loadUserDoc(newUser);
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
    setUser(newUser);
    await useDB(newUser).createUserDoc(username, settings);
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
    setUsername(null);
  };

  return (
    <Context.Provider
      value={{
        user,
        username,
        isAuthenticated,
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
