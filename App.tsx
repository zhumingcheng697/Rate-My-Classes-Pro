import React, { useMemo, Component } from "react";
import { useColorScheme } from "react-native";
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
import { getSchoolNames, getDepartmentNames } from "./libs/schedge";
import { ErrorType } from "./libs/types";
import { isObjectEmpty } from "./libs/utils";
import AlertPopup from "./components/AlertPopup";
import reducer from "./redux/reducers";
import { setDepartmentNameRecord, setSchoolNameRecord } from "./redux/actions";
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

type AppComponentProps = {
  error: ErrorType | null;
  showAlert: boolean;
  hideAlert: () => void;
};

function AppComponent({ error, showAlert, hideAlert }: AppComponentProps) {
  const colorScheme = useColorScheme();

  const navigationTheme = useMemo(
    () => ({
      ...(colorScheme === "dark" ? DarkTheme : DefaultTheme),
      colors: {
        ...(colorScheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
        primary: (colorScheme === "dark" ? darkColorStyle : lightColorStyle)
          .nyu,
        background: (colorScheme === "dark" ? darkColorStyle : lightColorStyle)
          .background.primary,
      },
    }),
    [colorScheme]
  );

  return (
    <Provider store={store}>
      <AuthProvider>
        <NativeBaseProvider theme={nativeBaseTheme}>
          <NavigationContainer theme={navigationTheme}>
            <AlertPopup
              body={
                error === ErrorType.noData
                  ? "This might be an issue with Schedge, our API provider for classes."
                  : undefined
              }
              isOpen={showAlert}
              onClose={hideAlert}
              onlyShowWhenFocused={false}
            />
            <RootNavigation />
          </NavigationContainer>
        </NativeBaseProvider>
      </AuthProvider>
    </Provider>
  );
}

type AppState = { error: ErrorType | null; showAlert: boolean };

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

  render() {
    const { error, showAlert } = this.state;
    return (
      <AppComponent
        error={error}
        showAlert={showAlert}
        hideAlert={() => {
          this.setState({ showAlert: false });
        }}
      />
    );
  }
}
