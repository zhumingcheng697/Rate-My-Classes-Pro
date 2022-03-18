import { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { createStore } from "redux";
import { Provider } from "react-redux";

import RootNavigation from "./navigation/RootNavigation";
import theme from "./shared/theme";
import reducer from "./redux/reducers";
import { getSchoolNames, getDepartmentNames } from "./shared/schedge";
import { setDepartmentNameRecord, setSchoolNameRecord } from "./redux/actions";

const store = createStore(reducer);

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
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigation />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    );
  }
}

type ThemeType = typeof theme;

declare module "native-base" {
  interface ICustomTheme extends ThemeType {}
}
