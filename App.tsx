import React, { useEffect } from "react";
import { Platform } from "react-native";
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
import { OAuthProvider } from "./libs/oauth";

Ionicons.loadFont();

const store = createStore(reducer);

type Theme = typeof nativeBaseTheme;

declare module "native-base" {
  interface ICustomTheme extends Theme {}
}

declare module "react-native" {
  interface NativeModulesStatic {
    RNHandoffModule?: {
      addUserActivity: (options: {
        activityType: string;
        title?: string;
        webpageURL?: string;
        eligibleForSearch?: boolean;
        eligibleForHandoff?: boolean;
        eligibleForPrediction?: boolean;
        isTemporary?: boolean;
        userInfo?: Record<string, any>;
      }) => Promise<void>;
      invalidateUserActivities: () => Promise<void>;
    };

    RNSystemFontModule?: {
      getSystemFont: (fontSize: number) => Promise<string>;
      getSystemSerifFont: (fontSize: number) => Promise<string>;
      getSystemRoundedFont: (fontSize: number) => Promise<string>;
      getSystemMonoFont: (fontSize: number) => Promise<string>;
    };
  }
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

  useEffect(() => {
    if (Platform.OS === "web") {
      const cardColor = navigationTheme.colors.card;

      document.documentElement.style.backgroundColor = cardColor;

      const themeColorEl = document.querySelector("meta[name=theme-color]");

      if (themeColorEl) themeColorEl.setAttribute("content", cardColor);
    }
  }, [navigationTheme.colors]);

  return (
    <Provider store={store}>
      <AuthProvider>
        <OAuthProvider>
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
        </OAuthProvider>
      </AuthProvider>
    </Provider>
  );
}
