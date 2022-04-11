import React, {
  useContext,
  useState,
  type ReactNode,
  createContext,
} from "react";
import Realm, { User } from "realm";
import app from "./app";

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

  const isAuthenticated = !!user && user.providerType !== "anon-user";

  const loadUserDoc = async (user: User) => {
    const db = useDB(user);
    const userDoc = await db.loadUserDoc();

    if (userDoc) {
      const { username, starredClasses, settings } = userDoc;
      const { semester, year } = settings.selectedSemester;
      setUsername(username);
      selectSemester(dispatch)(new Semester(semester, year));
      setShowPreviousSemesters(dispatch)(settings.showPreviousSemesters);
    }
  };

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
  };

  // The signUp function takes an email and password and uses the
  // emailPassword authentication provider to register the user.
  const signUpWithEmailPassword = async (
    username: string,
    email: string,
    password: string
  ) => {
    await app.emailPasswordAuth.registerUser({ email, password });
    setUsername(username);
    await signInWithEmailPassword(email, password);
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
