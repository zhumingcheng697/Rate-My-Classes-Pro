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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SEMESTER_SETTINGS_KEY,
  SEND_CODE_ENDPOINT,
  VERIFY_CODE_ENDPOINT,
} from "react-native-dotenv";
import Realm from "./Realm";

import realmApp from "./realmApp";
import Database from "./db";
import sync from "./sync";
import type { UserDoc } from "./types";
import {
  loadReviewedClasses,
  loadSettings,
  loadStarredClasses,
  selectSemester,
} from "../redux/actions";
import {
  asyncTryCatch,
  composeUsername,
  getFullClassCode,
  getFullSemesterCode,
  tryCatch,
} from "../libs/utils";
import type { ReviewedClassInfo, StarredClassInfo } from "../libs/types";
import { useAppState } from "../libs/hooks";
import { AppleOAuth, GoogleOAuth } from "../libs/oauth";
import Semester from "../libs/semester";

export type AuthContext = {
  db: Database | null;
  user: Realm.User | null;
  username: string | null;
  isSemesterSettled: boolean;
  isSettingsSettled: boolean;
  isUserDocLoaded: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  userDocError: any;
  globalAlerts: Set<MutableRefObject<any>>;
  setIsSemesterSettled: Dispatch<SetStateAction<boolean>>;
  setGlobalAlerts: Dispatch<SetStateAction<Set<MutableRefObject<any>>>>;
  fetchUserDoc: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  sendConfirmationCode: (email: string) => Promise<void>;
  verifyConfirmationCode: (code: string) => Promise<void>;
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
  deleteAppleAccount: (
    authCode: string,
    deleteReviews: boolean
  ) => Promise<void>;
  deleteGoogleAccount: (
    authCode: string,
    deleteReviews: boolean
  ) => Promise<void>;
  deleteEmailPasswordAccount: (deleteReviews: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = { children: ReactNode };

const Context = createContext<AuthContext | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(realmApp.currentUser);
  const [isSemesterSettled, setIsSemesterSettled] = useState(false);
  const [isSettingsSettled, setIsSettingsSettled] = useState(false);
  const [isUserDocLoaded, setIsUserDocLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userDocError, setUserDocError] = useState<any>(null);
  const syncCleanupRef = useRef<Set<() => void>>(new Set());
  const settings = useSelector((state) => state.settings);
  const appState = useAppState();
  const dispatch = useDispatch();
  const { isInternetReachable } = useNetInfo();
  const isAuthenticated = !!user && user.providerType !== "anon-user";
  const [resyncPending, setResyncPending] = useState(false);
  const [db, setDB] = useState<Database | null>(() =>
    realmApp.currentUser ? new Database(realmApp.currentUser) : null
  );
  const [globalAlerts, setGlobalAlerts] = useState<Set<MutableRefObject<any>>>(
    new Set()
  );

  const loadSelectedSemester = useCallback(async () => {
    const selectedSemester = Semester.fromCode(
      await asyncTryCatch(
        async () => await AsyncStorage.getItem(SEMESTER_SETTINGS_KEY)
      )
    );
    if (selectedSemester) {
      selectSemester(dispatch)(selectedSemester.toJSON());
    }
  }, [dispatch]);

  const syncCleanup = useCallback(() => {
    let count = 0;

    while (++count <= 3 && syncCleanupRef.current.size) {
      if (count >= 2 || syncCleanupRef.current.size > 1) {
        console.error(
          syncCleanupRef.current.size +
            " unsync callbacks found at run " +
            count
        );
      }

      [...syncCleanupRef.current].forEach((f) => {
        f();
        syncCleanupRef.current.delete(f);
      });
    }
  }, [syncCleanupRef.current]);

  const cleanupLocalProfile = useCallback(() => {
    loadStarredClasses(dispatch)({});
    loadReviewedClasses(dispatch)({});
    syncCleanup();
    setIsVerified(false);
    setUser(null);
    setDB(null);
  }, [syncCleanup]);

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = useCallback(async () => {
    if (!user) {
      cleanupLocalProfile();
      return;
    }

    asyncTryCatch(async () => {
      if (user.providerType === "anon-user") {
        await realmApp.deleteUser(user);
      } else {
        if (user.providerType === "oauth2-google") await GoogleOAuth.signOut();
        await realmApp.removeUser(user);
      }
    });

    if (!user.isLoggedIn) await user.logOut();
    cleanupLocalProfile();
  }, [user, dispatch, cleanupLocalProfile]);

  const updateUserDoc = useCallback(
    (userDoc?: Partial<UserDoc>) => {
      if (!userDoc) {
        setUserDocError(new Error("Your account might have been deleted"));
        signOut();
        return;
      }

      const { username, starred, reviewed, settings, verified } = userDoc;

      if (username) setUsername(username);

      const classToEntry = (info: StarredClassInfo | ReviewedClassInfo) => [
        getFullClassCode(info),
        info,
      ];

      if (starred)
        loadStarredClasses(dispatch)(
          Object.fromEntries(starred.map(classToEntry))
        );

      if (reviewed)
        loadReviewedClasses(dispatch)(
          Object.fromEntries(reviewed.map(classToEntry))
        );

      if (settings) loadSettings(dispatch)(settings);

      if (verified) setIsVerified(true);

      setIsUserDocLoaded(true);
      setIsSettingsSettled(true);
    },
    [user, dispatch, signOut]
  );

  useEffect(() => {
    if (!isSettingsSettled) return;

    asyncTryCatch(async () => {
      await AsyncStorage.setItem(
        SEMESTER_SETTINGS_KEY,
        getFullSemesterCode(settings.selectedSemester)
      );
    });
  }, [settings.selectedSemester.semesterCode, settings.selectedSemester.year]);

  useEffect(() => {
    if (appState === "background" || !isInternetReachable || !isAuthenticated) {
      syncCleanup();
      setResyncPending(false);
    } else if (
      appState === "active" &&
      isInternetReachable &&
      isAuthenticated
    ) {
      if (isUserDocLoaded) {
        restartSync(user, true);
        setResyncPending(false);
      } else {
        setResyncPending(true);
      }
    }
  }, [appState, isInternetReachable]);

  useEffect(() => setResyncPending(false), [user]);

  useEffect(() => {
    if (isAuthenticated && isUserDocLoaded && resyncPending) {
      restartSync(user, false);
    }
    setResyncPending(false);
  }, [isUserDocLoaded]);

  const sendConfirmationCode = useCallback(
    async (email: string) => {
      if (!isAuthenticated || isVerified) return;

      try {
        const res = await fetch(
          `${SEND_CODE_ENDPOINT}?id=${encodeURIComponent(
            user.id
          )}&email=${encodeURIComponent(email)}`
        );

        const json = await res.json();

        if (json !== user.id) throw json;
      } catch (e: any) {
        throw (
          (typeof e?.error === "string" &&
            tryCatch(() => JSON.parse(e.error))) ||
          e
        );
      }
    },
    [user, isAuthenticated, isVerified]
  );

  const verifyConfirmationCode = useCallback(
    async (code: string) => {
      if (!isAuthenticated || isVerified) return;

      try {
        const res = await fetch(
          `${VERIFY_CODE_ENDPOINT}?id=${encodeURIComponent(
            user.id
          )}&code=${encodeURIComponent(code.toLowerCase())}`
        );

        const json = await res.json();

        if (json !== user.id) throw json;

        setIsVerified(true);
      } catch (e: any) {
        throw (
          (typeof e?.error === "string" &&
            tryCatch(() => JSON.parse(e.error))) ||
          e
        );
      }
    },
    [user, isAuthenticated, isVerified]
  );

  const loadUserDoc = useCallback(
    async (user: Realm.User, db: Database, throws: boolean = false) => {
      if (user.providerType === "anon-user") return;

      try {
        const userDoc = await db.loadUserDoc();
        if (userDoc) {
          updateUserDoc(userDoc);
          setIsUserDocLoaded(true);
          setIsSettingsSettled(true);
          setUserDocError(null);
        } else {
          await signOut();
          throw new Error("Your account might have been deleted");
        }
      } catch (e: any) {
        await loadSelectedSemester();
        setIsSettingsSettled(true);
        if (
          /invalid.*(?:refresh|access|session|token|user)/i.test(
            e?.error || e?.message || ""
          )
        ) {
          e = new Error("Your account might have been deleted");
          await signOut();
        }

        if (throws) {
          throw e;
        } else {
          setUserDocError(e);
        }
      }
    },
    [updateUserDoc, signOut]
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
        syncCleanup();
        const unsync = sync(user, updateUserDoc);
        if (unsync) syncCleanupRef.current.add(unsync);
      }, 8000);
    },
    [syncCleanup, updateUserDoc, guardDB, loadUserDoc]
  );

  const fetchUserDoc = useCallback(async () => {
    if (user && isAuthenticated) {
      if (!isUserDocLoaded) await loadUserDoc(user, guardDB(user), true);
    } else {
      await loadSelectedSemester();
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
    [user, loadUserDoc, syncCleanup, signOut, restartSync]
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
    [user, settings, syncCleanup, signOut, restartSync]
  );

  const deleteOAuthAccount = useCallback(
    async (
      authCode: string,
      deleteReviews: boolean,
      provider: "Apple" | "Google"
    ) => {
      syncCleanup();

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

          if (user) {
            realmApp.switchUser(user);
            restartSync(user, true);
          }

          await newUser.logOut();
        });

        throw new Error(
          "Please authenticate using the same account you signed in with"
        );
      }

      // same user
      await newDB.deleteAccount(deleteReviews);
      await OAuth.revokeToken(refresh_token);
      await realmApp.deleteUser(newUser);
      await newUser.logOut();
      cleanupLocalProfile();
    },
    [user, cleanupLocalProfile, restartSync, syncCleanup]
  );

  const deleteAppleAccount = useCallback(
    async (authCode: string, deleteReviews: boolean) =>
      await deleteOAuthAccount(authCode, deleteReviews, "Apple"),
    [deleteOAuthAccount]
  );

  const deleteGoogleAccount = useCallback(
    async (authCode: string, deleteReviews: boolean) =>
      await deleteOAuthAccount(authCode, deleteReviews, "Google"),
    [deleteOAuthAccount]
  );

  const deleteEmailPasswordAccount = useCallback(
    async (deleteReviews: boolean) => {
      if (!user || !db || user.providerType !== "local-userpass") {
        return;
      }

      syncCleanup();

      await db.deleteAccount(deleteReviews);
      await realmApp.deleteUser(user);
      await user.logOut();
      cleanupLocalProfile();
    },
    [user, db, syncCleanup, cleanupLocalProfile]
  );

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
    [
      user,
      settings,
      loadUserDoc,
      syncCleanup,
      signOut,
      updateUserDoc,
      restartSync,
    ]
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
        isSemesterSettled,
        isSettingsSettled,
        isUserDocLoaded,
        isAuthenticated,
        isVerified,
        userDocError,
        globalAlerts,
        setIsSemesterSettled,
        setGlobalAlerts,
        fetchUserDoc,
        updateUsername,
        sendConfirmationCode,
        verifyConfirmationCode,
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
