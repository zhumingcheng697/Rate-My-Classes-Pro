import React, { useState, useMemo } from "react";
import { IconButton, Icon, Button, theme } from "native-base";
import { type RouteProp } from "@react-navigation/native";
import type {
  StackNavigationProp,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import AlertPopup from "../../components/AlertPopup";
import type {
  StarredClassInfo,
  SharedNavigationParamList,
} from "../../libs/types";
import { useClassInfoLoader } from "../../libs/hooks";
import { getFullClassCode } from "../../libs/utils";
import { useAuth } from "../../mongodb/auth";
import { useDB } from "../../mongodb/db";
import { starClass, unstarClass } from "../../redux/actions";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";

type DetailScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Detail"
>;

type DetailScreenRouteProp = RouteProp<SharedNavigationParamList, "Detail">;

export type DetailScreenOptionsProp = {
  navigation: DetailScreenNavigationProp;
  route: DetailScreenRouteProp;
};

export default ({
  navigation,
  route,
}: DetailScreenOptionsProp): StackNavigationOptions => ({
  title: getFullClassCode(route.params.classCode),
  headerRight: (props) => {
    const { classCode } = route.params;
    const { selectedSemester } = useSelector((state) => state.settings);
    const { classInfo } = useClassInfoLoader(
      classCode,
      selectedSemester,
      false
    );
    const starredClasses = useSelector((state) => state.starredClassRecord);
    const dispatch = useDispatch();
    const auth = useAuth();
    const [showAlert, setShowAlert] = useState(false);
    const isStarred =
      auth.isAuthenticated &&
      starredClasses &&
      !!starredClasses[getFullClassCode(classCode)];

    const db = useMemo(() => {
      if (auth.user) return useDB(auth.user);
    }, [auth.user]);

    return (
      <>
        <AlertPopup
          isOpen={showAlert}
          onClose={() => {
            setShowAlert(false);
          }}
          header={
            auth.isAuthenticated
              ? `Unable to ${isStarred ? "Unstar" : "Star"}`
              : "Sign In to Star"
          }
          body={
            auth.isAuthenticated
              ? undefined
              : "You need to sign in to keep track of your starred classes."
          }
          footerPrimaryButton={
            auth.isAuthenticated ? undefined : (
              <Button
                onPress={() => {
                  setShowAlert(false);
                  navigation.navigate("SignInSignUp", {
                    classCode: classInfo ?? classCode,
                  });
                }}
              >
                Sign In
              </Button>
            )
          }
        />
        <IconButton
          isDisabled={!classInfo}
          variant={"unstyled"}
          marginRight={"5px"}
          padding={"5px"}
          icon={
            <Icon
              {...(isStarred &&
                colorModeResponsiveStyle((selector) => ({
                  color: selector({
                    light: theme.colors.yellow[400],
                    dark: theme.colors.yellow[500],
                  }),
                })))}
              size={"22px"}
              as={<Ionicons name={"star" + (isStarred ? "" : "-outline")} />}
            />
          }
          onPress={async () => {
            if (auth.user && auth.isAuthenticated && db) {
              try {
                if (isStarred) {
                  await db.unstarClass(classCode);
                  unstarClass(dispatch)(classCode);
                } else if (classInfo) {
                  const starredClass: StarredClassInfo = {
                    ...classInfo,
                    starredDate: Date.now(),
                  };
                  await db.starClass(starredClass);
                  starClass(dispatch)(starredClass);
                }
              } catch (e) {
                setShowAlert(true);
              }
            } else {
              setShowAlert(true);
            }
          }}
          {...props}
        />
      </>
    );
  },
});
