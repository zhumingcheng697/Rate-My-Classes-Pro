import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";

import RootNavigation from "./navigation/RootNavigation";
import theme from "./shared/theme";

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigation />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

type ThemeType = typeof theme;

declare module "native-base" {
  interface ICustomTheme extends ThemeType {}
}
