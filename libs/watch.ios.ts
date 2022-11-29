import { useEffect } from "react";
import {
  useInstalled,
  transferUserInfo,
} from "react-native-watch-connectivity";

import { useAppState } from "./hooks";

export function useWatchConnectivity(isReady: boolean, context: string) {
  const isWatchAppInstalled = useInstalled();
  const appState = useAppState();
  useEffect(() => {
    if (isReady && isWatchAppInstalled && appState === "active") {
      transferUserInfo({ context });
    }
  }, [appState, isWatchAppInstalled, isReady, context]);
}
