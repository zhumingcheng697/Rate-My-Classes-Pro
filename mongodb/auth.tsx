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
import {
  asyncTryCatch,
  composeUsername,
  getFullClassCode,
} from "../libs/utils";
import { useAppState } from "../libs/hooks";
import { AppleOAuth, GoogleOAuth } from "../libs/oauth";

export type AuthContext = {
  db: Database | null;
  user: Realm.User | null;
  username: string | null;
  isSettingsSettled: boolean;
  isUserDocLoaded: boolean;
  isAuthenticated: boolean;
  userDocError: any;
  globalAlerts: Set<MutableRefObject<any>>;
  setGlobalAlerts: Dispatch<SetStateAction<Set<MutableRefObject<any>>>>;
  fetchUserDoc: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  continueWithApple: (
    idToken: string,
    username: string | null
  ) => Promise<void>;
  continueWithGoogle: (
    idToken: string,
    username: string | null
  ) => Promise<void>;
  signInAnonymously: (override?: boolean) => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  deleteAppleAccount: (authCode: string) => Promise<void>;
  deleteGoogleAccount: (authCode: string) => Promise<void>;
  deleteEmailPasswordAccount: () => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = { children: ReactNode };

const Context = createContext<AuthContext | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(realmApp.currentUser);
  const [isSettingsSettled, setIsSettingsSettled] = useState(false);
  const [isUserDocLoaded, setIsUserDocLoaded] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userDocError, setUserDocError] = useState<any>(null);
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

  const cleanupLocalProfile = useCallback(() => {
    loadStarredClasses(dispatch)({});
    loadReviewedClasses(dispatch)({});
    syncCleanup();
    setUser(null);
    setDB(null);
  }, [syncCleanup]);

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = useCallback(async () => {
    if (user === null) {
      console.error("Not logged in, can't log out!");
      return;
    }

    if (user.providerType === "anon-user") {
      await asyncTryCatch(async () => await realmApp.deleteUser(user));
    } else {
      if (user.providerType === "oauth2-google")
        await asyncTryCatch(async () => await GoogleOAuth.signOut());
      await asyncTryCatch(async () => await realmApp.removeUser(user));
    }

    await user.logOut();
    cleanupLocalProfile();
  }, [user, dispatch, cleanupLocalProfile]);

  const updateUserDoc = useCallback(
    (userDoc?: Partial<UserDoc>) => {
      if (!userDoc) return;

      const { username, starred, reviewed, settings } = userDoc;

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
      isAuthenticated &&
      isUserDocLoaded
    ) {
      restartSync(user, true);
    }
  }, [appState, isInternetReachable, isUserDocLoaded]);

  const loadUserDoc = useCallback(
    async (user: Realm.User, db: Database, throws: boolean = false) => {
      console.log(user.isLoggedIn, user.state, user.identities);
      if (user.providerType === "anon-user") return;

      try {
        const userDoc = await db.loadUserDoc();
        if (userDoc) updateUserDoc(userDoc);

        setIsUserDocLoaded(true);
        setIsSettingsSettled(true);
        setUserDocError(null);
      } catch (e) {
        setIsSettingsSettled(true);
        console.error(e);
        if (throws) {
          throw e;
        } else {
          setUserDocError(e);
        }
      }
    },
    [updateUserDoc]
  );

  const guardDB = useCallback(
    (user: Realm.User) => {
      let currDB = db;
      if (!currDB) currDB = new Database(user);
      setDB(currDB);
      return currDB;
    },
    [db]
  );

  const restartSync = useCallback(
    async (user: Realm.User, reload: boolean) => {
      syncCleanup();
      if (user.providerType === "anon-user") return;

      if (reload) await loadUserDoc(user, guardDB(user));

      setTimeout(() => {
        syncCleanupRef.current = sync(user, updateUserDoc) ?? null;
      }, 1000);
    },
    [syncCleanup, updateUserDoc, guardDB, loadUserDoc]
  );

  const fetchUserDoc = useCallback(async () => {
    if (user && isAuthenticated) {
      if (!isUserDocLoaded) await loadUserDoc(user, guardDB(user), true);
    } else {
      setIsUserDocLoaded(true);
      setIsSettingsSettled(true);
    }
  }, [user, isAuthenticated, isUserDocLoaded, loadUserDoc, guardDB]);

  const updateUsername = useCallback(
    async (newUsername: string) => {
      if (!isAuthenticated) return;

      const oldUsername = username;

      try {
        await guardDB(user).updateUsername(newUsername);
        setUsername(newUsername);
      } catch (e) {
        setUsername(oldUsername);
        console.error(e);
        throw e;
      }
    },
    [user, username, isAuthenticated, guardDB]
  );

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
      setUser(newUser);
      setDB(newDB);
      await loadUserDoc(newUser, newDB);
      restartSync(newUser, false);
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
      setUser(newUser);
      setDB(newDB);
      setIsSettingsSettled(true);
      setIsUserDocLoaded(true);
      await newDB.guardUserDoc(username, settings);
      restartSync(newUser, false);
    },
    [user, settings, syncCleanup, signOut]
  );

  const deleteOAuthAccount = useCallback(
    async (authCode: string, provider: "Apple" | "Google") => {
      const OAuth = provider === "Apple" ? AppleOAuth : GoogleOAuth;
      const token = await OAuth.getToken(authCode);

      if (!token || !token.id_token || !token.refresh_token)
        throw new Error("Unable to retrieve id token or refresh token");

      const { id_token, refresh_token } = token;

      const credential =
        provider === "Apple"
          ? Realm.Credentials.jwt(id_token)
          : Realm.Credentials.google(id_token);
      const newUser = await realmApp.logIn(credential);
      const newDB = new Database(newUser);
      const existingUserDoc = await newDB.loadUserDoc();

      // not the same user
      if (!user || user.id !== newUser.id) {
        await asyncTryCatch(async () => {
          if (!existingUserDoc) {
            await OAuth.revokeToken(refresh_token);
            await realmApp.deleteUser(newUser);
          } else {
            await realmApp.removeUser(newUser);
          }

          if (user) realmApp.switchUser(user);

          await newUser.logOut();
        });
        throw new Error(
          "Please authenticate using the same account you signed in with."
        );
      }

      // same user
      await newDB.deleteAccount();
      await OAuth.revokeToken(refresh_token);
      await realmApp.deleteUser(newUser);
      await newUser.logOut();
      cleanupLocalProfile();
      return;
    },
    [user]
  );

  const deleteAppleAccount = useCallback(
    async (authCode: string) => await deleteOAuthAccount(authCode, "Apple"),
    [deleteOAuthAccount]
  );

  const deleteGoogleAccount = useCallback(
    async (authCode: string) => await deleteOAuthAccount(authCode, "Google"),
    [deleteOAuthAccount]
  );

  const deleteEmailPasswordAccount = useCallback(async () => {
    if (!user || !db || user.providerType !== "local-userpass") {
      return;
    }

    await db.deleteAccount();
    await realmApp.deleteUser(user);
    await user.logOut();
    cleanupLocalProfile();
  }, [user]);

  const signInWithOAuth = useCallback(
    async (
      idToken: string,
      username: string | null,
      provider: "Apple" | "Google"
    ) => {
      if (user) await signOut();
      syncCleanup();

      const credential =
        provider === "Apple"
          ? Realm.Credentials.jwt(idToken)
          : Realm.Credentials.google(idToken);
      const newUser = await realmApp.logIn(credential);
      const newDB = new Database(newUser);

      setIsSettingsSettled(false);
      setIsUserDocLoaded(false);
      setUser(newUser);
      setDB(newDB);

      username =
        username ||
        composeUsername({
          fullName: newUser.profile.name,
          givenName: newUser.profile.firstName,
          familyName: newUser.profile.lastName,
        }) ||
        "User";

      const existingUserDoc = await newDB.guardUserDoc(username, settings);

      if (existingUserDoc) {
        updateUserDoc(existingUserDoc);
      } else {
        setUsername(username);
        setIsSettingsSettled(true);
        setIsUserDocLoaded(true);
      }

      restartSync(newUser, false);
    },
    [user, settings, loadUserDoc, syncCleanup, signOut]
  );

  const continueWithApple = useCallback(
    async (idToken: string, username: string | null) =>
      await signInWithOAuth(idToken, username, "Apple"),
    [signInWithOAuth]
  );

  const continueWithGoogle = useCallback(
    async (idToken: string, username: string | null) =>
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
        userDocError,
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
        deleteAppleAccount,
        deleteGoogleAccount,
        deleteEmailPasswordAccount,
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
