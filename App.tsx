import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";

import RootNavigation from "./navigation/RootNavigation";

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigation />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
