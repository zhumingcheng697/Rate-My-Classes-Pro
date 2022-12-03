import { useEffect } from "react";
import {
  useInstalled,
  transferUserInfo,
  updateApplicationContext,
} from "react-native-watch-connectivity";

import { useAppState } from "./hooks";
import type { WatchAppContext } from "./types";

export function useWatchConnectivity(
  isReady: boolean,
  context: WatchAppContext
) {
  const isWatchAppInstalled = useInstalled();
  const appState = useAppState();
  useEffect(() => {
    if (isReady && isWatchAppInstalled && appState === "active") {
      transferUserInfo(context);
      updateApplicationContext(context);
    }
  }, [appState, isWatchAppInstalled, isReady, context]);
}
