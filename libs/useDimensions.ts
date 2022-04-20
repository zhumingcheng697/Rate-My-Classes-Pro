import { useWindowDimensions } from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import useIsCatalyst from "./useIsCatalyst";

export default function useDimensions() {
  const isCatalyst = useIsCatalyst();

  if (isCatalyst) {
    return useSafeAreaFrame();
  } else {
    return useWindowDimensions();
  }
}
