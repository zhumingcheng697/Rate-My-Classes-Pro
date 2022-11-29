import { useEffect } from "react";
import {
  updateApplicationContext,
  useApplicationContext,
  useInstalled,
} from "react-native-watch-connectivity";

export function useWatchConnectivity(isReady: boolean, context: string) {
  const isWatchAppInstalled = useInstalled();
  const applicationContext = useApplicationContext();
  useEffect(() => {
    if (isWatchAppInstalled && isReady) {
      updateApplicationContext({ context });
    }
  }, [isWatchAppInstalled, applicationContext, isReady, context]);
}
