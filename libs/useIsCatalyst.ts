import { useMemo } from "react";
import { Platform } from "react-native";

export default function useIsCatalyst() {
  const isCatalyst = useMemo(
    () =>
      Platform.OS === "ios" &&
      (!/^(?:phone|pad)$/i.test(Platform.constants.interfaceIdiom) ||
        (!Platform.isPad && /pad/i.test(Platform.constants.systemName))),
    [Platform]
  );

  return isCatalyst;
}
