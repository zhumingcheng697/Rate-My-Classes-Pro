import React, { Component } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import "react-native-config";

import RootNavigation from "./navigation/RootNavigation";
import nativeBaseTheme, { colorStyle } from "./libs/theme";
import { getSchoolNames, getDepartmentNames } from "./libs/schedge";
import { ErrorType } from "./libs/types";
import { isObjectEmpty } from "./libs/utils";
import AlertPopup from "./components/AlertPopup";
import reducer from "./redux/reducers";
import { setDepartmentNameRecord, setSchoolNameRecord } from "./redux/actions";
import { AuthProvider } from "./mongodb/auth";
import { useDB } from "./mongodb/db";
import app from "./mongodb/app";

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

type Config = {
  REALM_APP_ID: string;
  GOOGLE_WEB_CLIENT_ID: string;
  GOOGLE_IOS_CLIENT_ID: string;
};

declare module "react-native-config" {
  interface NativeConfig extends Config {}
}

type AppState = { error: ErrorType | null; showAlert: boolean };

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colorStyle.nyu,
    background: colorStyle.background.primary,
  },
};

export default class App extends Component<{}, AppState> {
  state: AppState = {
    error: null,
    showAlert: false,
  };

  unsubsriceRedux = () => {};

  reduxListener = (() => {
    let previousSettings = store.getState().settings;

    return async () => {
      const { settings } = store.getState();

      if (settings !== previousSettings) {
        if (app.currentUser && app.currentUser.providerType !== "anon-user") {
          await useDB(app.currentUser).updateSettings(settings);
        }
      }
    };
  })();

  componentWillUnmount() {
    this.unsubsriceRedux();
  }

  componentDidMount() {
    this.unsubsriceRedux = store.subscribe(this.reduxListener.bind(this));

    getSchoolNames()
      .then((record) => {
        if (record && !isObjectEmpty(record)) {
          setSchoolNameRecord(store.dispatch)(record);
        } else {
          this.setState({ error: ErrorType.noData, showAlert: true });
        }
      })
      .catch((e) => {
        console.error(e);
        this.setState({ error: ErrorType.network, showAlert: true });
      });

    getDepartmentNames()
      .then((record) => {
        if (record && !isObjectEmpty(record)) {
          setDepartmentNameRecord(store.dispatch)(record);
        } else {
          this.setState({ error: ErrorType.noData, showAlert: true });
        }
      })
      .catch((e) => {
        console.error(e);
        this.setState({ error: ErrorType.network, showAlert: true });
      });
  }

  clearLoadError() {
    this.setState({ showAlert: false });
  }

  render() {
    return (
      <Provider store={store}>
        <AuthProvider>
          <NativeBaseProvider theme={nativeBaseTheme}>
            <NavigationContainer theme={navigationTheme}>
              <AlertPopup
                body={
                  this.state.error === ErrorType.noData
                    ? "This might be an issue with Schedge, our API provider for classes."
                    : undefined
                }
                isOpen={this.state.showAlert}
                onClose={this.clearLoadError.bind(this)}
                onlyShowWhenFocused={false}
              />
              <RootNavigation />
            </NavigationContainer>
          </NativeBaseProvider>
        </AuthProvider>
      </Provider>
    );
  }
}
