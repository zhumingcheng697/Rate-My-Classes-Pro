import { Component, createRef } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, AlertDialog, Button } from "native-base";
import { createStore } from "redux";
import { Provider } from "react-redux";

import RootNavigation from "./navigation/RootNavigation";
import nativeBaseTheme, { colorStyle } from "./shared/theme";
import reducer from "./redux/reducers";
import { getSchoolNames, getDepartmentNames } from "./shared/schedge";
import { setDepartmentNameRecord, setSchoolNameRecord } from "./redux/actions";

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
    const ref = createRef();

    return (
      <Provider store={store}>
        <NativeBaseProvider theme={nativeBaseTheme}>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar style="auto" />
            <AlertDialog
              leastDestructiveRef={ref}
              isOpen={this.state.loadError}
              onClose={this.clearLoadError.bind(this)}
            >
              <AlertDialog.Content>
                <AlertDialog.Header>
                  Unable to Load Class Information
                </AlertDialog.Header>
                <AlertDialog.Body>
                  Please check your internet connection or try again later.
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button ref={ref} onPress={this.clearLoadError.bind(this)}>
                    OK
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
            <RootNavigation />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    );
  }
}
