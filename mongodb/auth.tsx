import React, { useContext, useState, ReactNode, createContext } from "react";
import Realm, { User } from "realm";
import app from "./app";

type AuthContext = {
  user: User | null;
  isUserAnonymous: boolean;
  signInAnonymously: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Context = createContext<AuthContext | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(app.currentUser);
  const [isUserAnonymous, setIsUserAnonymous] = useState(false);

  const signInAnonymously = async () => {
    console.log("signInAnonymously", 1);
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    console.log("signInAnonymously", 2, credentials, user);
    setUser(user);
    setIsUserAnonymous(true);
  };

  // The signIn function takes an email and password and uses the
  // emailPassword authentication provider to log in.
  const signIn = async (email: string, password: string) => {
    console.log("signIn", 1);
    const credentials = Realm.Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);
    console.log("signIn", 2, credentials, user);
    setUser(user);
    setIsUserAnonymous(false);
  };

  // The signUp function takes an email and password and uses the
  // emailPassword authentication provider to register the user.
  const signUp = async (email: string, password: string) => {
    console.log("signUp", 1);
    await app.emailPasswordAuth.registerUser({ email, password });
    console.log("signUp", 2);
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
        signIn,
        signUp,
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
