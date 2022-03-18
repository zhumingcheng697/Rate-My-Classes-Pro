import { Component } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { createStore } from "redux";
import { Provider } from "react-redux";

import RootNavigation from "./navigation/RootNavigation";
import nativeBaseTheme, { colorStyle } from "./shared/theme";
import reducer from "./redux/reducers";
import { getSchoolNames, getDepartmentNames } from "./shared/schedge";
import { setDepartmentNameRecord, setSchoolNameRecord } from "./redux/actions";

const store = createStore(reducer);

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colorStyle.nyu,
  },
};

export default class App extends Component<undefined, undefined> {
  componentDidMount() {
    getSchoolNames()
      .then((record) => {
        setSchoolNameRecord(store.dispatch)(record);
      })
      .catch((e) => {
        console.error(e);
      });

    getDepartmentNames()
      .then((record) => {
        setDepartmentNameRecord(store.dispatch)(record);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  render() {
    return (
      <Provider store={store}>
        <NativeBaseProvider theme={nativeBaseTheme}>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar style="auto" />
            <RootNavigation />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    );
  }
}

type ThemeType = typeof nativeBaseTheme;

declare module "native-base" {
  interface ICustomTheme extends ThemeType {}
}

type RootState = ReturnType<typeof store.getState>;

declare module "react-redux" {
  interface DefaultRootState extends RootState {}
}
