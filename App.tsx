import React, { useMemo, Component, useState, useCallback } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import RootNavigation from "./navigation/RootNavigation";
import nativeBaseTheme, { lightColorStyle, darkColorStyle } from "./libs/theme";
import { useColorScheme } from "./libs/hooks";
import reducer from "./redux/reducers";
import { AuthProvider } from "./mongodb/auth";
import { useDB } from "./mongodb/db";
import realmApp from "./mongodb/realmApp";
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

function AppComponent() {
  const getNavigationTheme = useCallback(
    (colorScheme) => ({
      ...(colorScheme === "dark" ? DarkTheme : DefaultTheme),
      colors: {
        ...(colorScheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
        primary: (colorScheme === "dark" ? darkColorStyle : lightColorStyle)
          .nyu,
        background: (colorScheme === "dark" ? darkColorStyle : lightColorStyle)
          .background.primary,
      },
    }),
    []
  );

  const colorScheme = useColorScheme();
  const [navigationTheme, setNavigationScheme] = useState(() =>
    getNavigationTheme(colorScheme)
  );
  const colorModeManager = useMemo(
    () => ({
      get: async () => {
        setNavigationScheme(getNavigationTheme(colorScheme));
        return colorScheme;
      },
      set: async () => {},
    }),
    [colorScheme]
  );

  return (
    <Provider store={store}>
      <AuthProvider>
        <NativeBaseProvider
          theme={nativeBaseTheme}
          colorModeManager={colorModeManager}
        >
          <NavigationContainer theme={navigationTheme}>
            <RootNavigation />
          </NavigationContainer>
        </NativeBaseProvider>
      </AuthProvider>
    </Provider>
  );
}

export default class App extends Component {
  unsubsriceRedux = () => {};

  reduxListener = (() => {
    let previousSettings = store.getState().settings;

    return async () => {
      const { settings } = store.getState();

      if (settings !== previousSettings) {
        if (
          realmApp.currentUser &&
          realmApp.currentUser.providerType !== "anon-user"
        ) {
          await useDB(realmApp.currentUser).updateSettings(settings);
        }
      }
    };
  })();

  componentWillUnmount() {
    this.unsubsriceRedux();
  }

  componentDidMount() {
    this.unsubsriceRedux = store.subscribe(this.reduxListener.bind(this));
  }

  render() {
    return <AppComponent />;
  }
}
