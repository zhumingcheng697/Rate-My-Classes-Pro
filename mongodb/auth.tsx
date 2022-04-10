import React, { useContext, useState, ReactNode, createContext } from "react";
import Realm, { User } from "realm";
import app from "./app";

type AuthContext = {
  user: User | null;
  isUserAnonymous: boolean;
  signInAnonymously: () => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string) => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Context = createContext<AuthContext | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(app.currentUser);
  const [isUserAnonymous, setIsUserAnonymous] = useState(false);

  const signInAnonymously = async () => {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    setUser(user);
    setIsUserAnonymous(true);
  };

  // The signIn function takes an email and password and uses the
  // emailPassword authentication provider to log in.
  const signInWithEmailPassword = async (email: string, password: string) => {
    const credentials = Realm.Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);
    setUser(user);
    setIsUserAnonymous(false);
  };

  // The signUp function takes an email and password and uses the
  // emailPassword authentication provider to register the user.
  const signUpWithEmailPassword = async (email: string, password: string) => {
    await app.emailPasswordAuth.registerUser({ email, password });
    await signInWithEmailPassword(email, password);
  };

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = async () => {
    if (user === null) {
      console.warn("Not logged in, can't log out!");
      return;
    }
    await user.logOut();
    setUser(null);
    setIsUserAnonymous(false);
  };

  return (
    <Context.Provider
      value={{
        user,
        isUserAnonymous,
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
