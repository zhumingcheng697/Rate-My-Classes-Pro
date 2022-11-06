// https://github.com/mongodb-university/realm-tutorial-react-native/blob/final/providers/AuthProvider.js

import React, {
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
  useContext,
  useState,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import Realm from "./Realm";

import realmApp from "./realmApp";
import Database from "./db";
import sync from "./sync";
import type { UserDoc } from "./types";
import {
  loadReviewedClasses,
  loadSettings,
  loadStarredClasses,
} from "../redux/actions";
import { getFullClassCode } from "../libs/utils";
import { useAppState } from "../libs/hooks";

type AuthContext = {
  db: Database | null;
  user: Realm.User | null;
  username: string | null;
  isSettingsSettled: boolean;
  isUserDocLoaded: boolean;
  isAuthenticated: boolean;
  globalAlerts: Set<MutableRefObject<any>>;
  setGlobalAlerts: Dispatch<SetStateAction<Set<MutableRefObject<any>>>>;
  fetchUserDoc: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  continueWithApple: (idToken: string, username: string) => Promise<void>;
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
  const syncCleanupRef = useRef<(() => void) | null>(null);
  const settings = useSelector((state) => state.settings);
  const appState = useAppState();
  const dispatch = useDispatch();
  const { isInternetReachable } = useNetInfo();
  const isAuthenticated = !!user && user.providerType !== "anon-user";
  const [db, setDB] = useState<Database | null>(() =>
    realmApp.currentUser ? new Database(realmApp.currentUser) : null
  );
  const [globalAlerts, setGlobalAlerts] = useState<Set<MutableRefObject<any>>>(
    new Set()
  );

  const syncCleanup = useCallback(() => {
    if (syncCleanupRef.current) {
      syncCleanupRef.current();
      syncCleanupRef.current = null;
    }
  }, [syncCleanupRef.current]);

  const updateUserDoc = useCallback(
    ({ username, starred, reviewed, settings }: Partial<UserDoc>) => {
      if (username) setUsername(username);

      if (starred)
        loadStarredClasses(dispatch)(
          Object.fromEntries(
            starred.map((info) => [getFullClassCode(info), info])
          )
        );

      if (reviewed)
        loadReviewedClasses(dispatch)(
          Object.fromEntries(
            reviewed.map((info) => [getFullClassCode(info), info])
          )
        );

      if (settings) loadSettings(dispatch)(settings);

      setIsUserDocLoaded(true);
      setIsSettingsSettled(true);
    },
    [dispatch]
  );

  useEffect(() => {
    if (appState === "background" || !isInternetReachable || !isAuthenticated) {
      syncCleanup();
    } else if (
      appState === "active" &&
      isInternetReachable &&
      isAuthenticated
    ) {
      restartSync(isUserDocLoaded);
    }
  }, [appState, isInternetReachable]);

  const loadUserDoc = useCallback(
    async (user: Realm.User, db: Database) => {
      console.log(user.isLoggedIn, user.state, user.identities);
      if (user.providerType === "anon-user") return;

      try {
        const userDoc = await db.loadUserDoc();
        if (userDoc) updateUserDoc(userDoc);

        setIsUserDocLoaded(true);
        setIsSettingsSettled(true);
      } catch (e) {
        setIsSettingsSettled(true);
        console.error(e);
        throw e;
      }
    },
    [updateUserDoc]
  );

  const guardDB = useCallback(
    (user: Realm.User) => {
      let currDB = db;
      if (!currDB) {
        currDB = new Database(user);
      }
      setDB(currDB);
      return currDB;
    },
    [db]
  );

  const restartSync = useCallback(
    async (reload: boolean) => {
      syncCleanup();
      if (user && isAuthenticated) {
        if (reload) {
          try {
            await loadUserDoc(user, guardDB(user));
          } catch (e) {
            console.error(e);
          }
        }

        setTimeout(() => {
          syncCleanupRef.current = sync(user, updateUserDoc) ?? null;
        }, 1000);
      }
    },
    [user, isAuthenticated, syncCleanup, updateUserDoc, guardDB, loadUserDoc]
  );

  const fetchUserDoc = useCallback(async () => {
    if (user && isAuthenticated) {
      if (!isUserDocLoaded) {
        await loadUserDoc(user, guardDB(user));
      }
    } else {
      setIsUserDocLoaded(true);
      setIsSettingsSettled(true);
    }
  }, [user, isAuthenticated, isUserDocLoaded, loadUserDoc, guardDB]);

  const updateUsername = useCallback(
    async (newUsername: string) => {
      if (!isAuthenticated) return;

      const oldUsername = username;
      setUsername(username);

      try {
        await guardDB(user).updateUsername(newUsername);
      } catch (e) {
        setUsername(oldUsername);
        console.error(e);
        throw e;
      }
    },
    [user, username, isAuthenticated, guardDB]
  );

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = useCallback(async () => {
    if (user === null) {
      console.warn("Not logged in, can't log out!");
      return;
    }

    if (user.providerType === "anon-user") await realmApp.deleteUser(user);

    await user.logOut();
    loadStarredClasses(dispatch)({});
    loadReviewedClasses(dispatch)({});
    syncCleanup();
    setUser(null);
    setDB(null);
  }, [user, dispatch]);

  const signInAnonymously = useCallback(
    async (override: boolean = false) => {
      if (user && !override) return;
      syncCleanup();

      const credentials = Realm.Credentials.anonymous();
      const newUser = await realmApp.logIn(credentials);
      setUser(newUser);
      setDB(new Database(newUser));
    },
    [user, syncCleanup]
  );

  // The signIn function takes an email and password and uses the
  // emailPassword authentication provider to log in.
  const signInWithEmailPassword = useCallback(
    async (email: string, password: string) => {
      if (user) await signOut();
      syncCleanup();

      const credentials = Realm.Credentials.emailPassword(email, password);
      const newUser = await realmApp.logIn(credentials);
      const newDB = new Database(newUser);
      setIsSettingsSettled(false);
      setIsUserDocLoaded(false);
      await loadUserDoc(newUser, newDB);
      setUser(newUser);
      setDB(newDB);
      restartSync(false);
    },
    [user, loadUserDoc, syncCleanup, signOut]
  );

  // The signUp function takes an email and password and uses the
  // emailPassword authentication provider to register the user.
  const signUpWithEmailPassword = useCallback(
    async (username: string, email: string, password: string) => {
      if (user) await signOut();
      syncCleanup();

      await realmApp.emailPasswordAuth.registerUser({ email, password });
      setUsername(username);
      const credentials = Realm.Credentials.emailPassword(email, password);
      const newUser = await realmApp.logIn(credentials);
      const newDB = new Database(newUser);
      await newDB.createUserDoc(username, settings);
      setUser(newUser);
      setDB(newDB);
      restartSync(false);
    },
    [user, settings, syncCleanup, signOut]
  );

  const signInWithOAuth = useCallback(
    async (idToken: string, username: string, provider: "Apple" | "Google") => {
      if (user) await signOut();
      syncCleanup();

      const credential =
        provider === "Apple"
          ? Realm.Credentials.jwt(idToken)
          : Realm.Credentials.google(idToken);
      const newUser = await realmApp.logIn(credential);
      const newDB = new Database(newUser);
      const upserted = await newDB.createUserDoc(username, settings);

      if (upserted) {
        setUsername(username);
      } else {
        setIsSettingsSettled(false);
        setIsUserDocLoaded(false);
        await loadUserDoc(newUser, newDB);
      }

      setUser(newUser);
      setDB(newDB);
      restartSync(false);
    },
    [user, settings, loadUserDoc, syncCleanup, signOut]
  );

  const continueWithApple = useCallback(
    async (idToken: string, username: string) =>
      await signInWithOAuth(idToken, username, "Apple"),
    [signInWithOAuth]
  );

  const continueWithGoogle = useCallback(
    async (idToken: string, username: string) =>
      await signInWithOAuth(idToken, username, "Google"),
    [signInWithOAuth]
  );

  return (
    <Context.Provider
      value={{
        db,
        user,
        username,
        isSettingsSettled,
        isUserDocLoaded,
        isAuthenticated,
        globalAlerts,
        setGlobalAlerts,
        fetchUserDoc,
        updateUsername,
        continueWithApple,
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
