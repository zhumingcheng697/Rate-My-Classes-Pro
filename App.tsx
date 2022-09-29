import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import RootNavigation from "./navigation/RootNavigation";
import { useColorModeSynchronizer } from "./libs/color-mode-utils";
import nativeBaseTheme from "./libs/theme";
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
  const { colorModeManager, navigationTheme } = useColorModeSynchronizer();

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
