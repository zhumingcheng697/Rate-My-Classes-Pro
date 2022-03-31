import React, { Component } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import RootNavigation from "./navigation/RootNavigation";
import nativeBaseTheme, { colorStyle } from "./shared/theme";
import reducer from "./redux/reducers";
import { getSchoolNames, getDepartmentNames } from "./shared/schedge";
import { setDepartmentNameRecord, setSchoolNameRecord } from "./redux/actions";
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

type AppState = {
  loadError: boolean;
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colorStyle.nyu.default,
    background: colorStyle.background.primary,
  },
};

export default class App extends Component<undefined, AppState> {
  state: AppState = {
    loadError: false,
  };

  componentDidMount() {
    getSchoolNames()
      .then((record) => {
        setSchoolNameRecord(store.dispatch)(record);
      })
      .catch((e) => {
        console.error(e);
        this.setState({ loadError: true });
      });

    getDepartmentNames()
      .then((record) => {
        setDepartmentNameRecord(store.dispatch)(record);
      })
      .catch((e) => {
        console.error(e);
        this.setState({ loadError: true });
      });
  }

  clearLoadError() {
    this.setState({ loadError: false });
  }

  render() {
    return (
      <Provider store={store}>
        <NativeBaseProvider theme={nativeBaseTheme}>
          <NavigationContainer theme={navigationTheme}>
            <AlertPopup
              isOpen={this.state.loadError}
              onClose={this.clearLoadError.bind(this)}
            />
            <RootNavigation />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    );
  }
}
