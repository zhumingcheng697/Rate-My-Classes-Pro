import React, { Component } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import config from "react-native-config";

import RootNavigation from "./navigation/RootNavigation";
import nativeBaseTheme, { colorStyle } from "./shared/theme";
import reducer from "./redux/reducers";
import { setDepartmentNameRecord, setSchoolNameRecord } from "./redux/actions";
import { getSchoolNames, getDepartmentNames } from "./shared/schedge";
import { ErrorType } from "./shared/types";
import { isObjectEmpty } from "./shared/utils";
import AlertPopup from "./components/AlertPopup";

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
};

declare module "react-native-config" {
  interface NativeConfig extends Config {}
}

console.log(config.REALM_APP_ID);

type AppState = {
  error: ErrorType | null;
  showAlert: boolean;
};

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

  componentDidMount() {
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
            />
            <RootNavigation />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    );
  }
}
