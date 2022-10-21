import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createStore } from "redux";
import { Provider } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import Ionicons from "react-native-vector-icons/Ionicons";

import linking from "./navigation/linking";
import RootNavigation from "./navigation/RootNavigation";
import { AuthProvider } from "./mongodb/auth";
import reducer from "./redux/reducers";
import { useColorModeSynchronizer } from "./styling/color-mode-utils";
import nativeBaseTheme from "./styling/theme";
import { useAppState } from "./libs/hooks";
import "./libs/GoogleSignIn";

Ionicons.loadFont();

const store = createStore(reducer);

type Theme = typeof nativeBaseTheme;

declare module "native-base" {
  interface ICustomTheme extends Theme {}
}

type RootState = ReturnType<typeof store.getState>;

declare module "react-redux" {
  interface DefaultRootState extends RootState {}
}

export default function App() {
  const { colorModeManager, navigationTheme } = useColorModeSynchronizer();
  const appState = useAppState();

  useEffect(() => {
    if (appState === "active") NetInfo.refresh();
  }, [appState]);

  return (
    <Provider store={store}>
      <AuthProvider>
        <NativeBaseProvider
          theme={nativeBaseTheme}
          colorModeManager={colorModeManager}
        >
          <NavigationContainer
            linking={linking}
            theme={navigationTheme}
            documentTitle={{
              formatter: (options, route) =>
                options?.title ?? route?.name
                  ? `${options?.title ?? route?.name} | Rate My Classes Pro`
                  : "Rate My Classes Pro",
            }}
          >
            <RootNavigation />
          </NavigationContainer>
        </NativeBaseProvider>
      </AuthProvider>
    </Provider>
  );
}
