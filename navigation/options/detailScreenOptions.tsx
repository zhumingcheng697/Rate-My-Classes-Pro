import React, { useState, useMemo } from "react";
import { IconButton, Icon, Button } from "native-base";
import { type RouteProp } from "@react-navigation/native";
import type {
  StackNavigationProp,
  StackNavigationOptions,
} from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import { starClass, unstarClass } from "../../redux/actions";
import { type SharedNavigationParamList } from "../../libs/types";
import { getFullClassCode } from "../../libs/utils";
import { useAuth } from "../../mongodb/auth";
import AlertPopup from "../../components/AlertPopup";
import { useDB } from "../../mongodb/db";

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
  title: getFullClassCode(route.params.classInfo),
  headerRight: (props) => {
    const { classInfo } = route.params;
    const starredClasses = useSelector((state) => state.starredClassRecord);
    const dispatch = useDispatch();
    const auth = useAuth();
    const [showAlert, setShowAlert] = useState(false);
    const isStarred =
      auth.isAuthenticated &&
      starredClasses &&
      !!starredClasses[getFullClassCode(classInfo)];

    const db = useMemo(() => {
      if (auth.user) return useDB(auth.user);
      auth.signInAnonymously();
    }, [auth.user]);

    return (
      <>
        <AlertPopup
          isOpen={showAlert}
          onClose={() => {
            setShowAlert(false);
          }}
          header={auth.isAuthenticated ? "Unable to Star" : "Sign In to Star"}
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
                  navigation.navigate("SignInSignUp");
                }}
              >
                Sign In
              </Button>
            )
          }
        />
        <IconButton
          variant={"unstyled"}
          marginRight={"5px"}
          padding={"5px"}
          icon={
            <Icon
              color={isStarred ? "yellow.400" : undefined}
              _dark={{ color: isStarred ? "yellow.500" : undefined }}
              size={"22px"}
              as={<Ionicons name={"star" + (isStarred ? "" : "-outline")} />}
            />
          }
          onPress={async () => {
            if (auth.user && auth.isAuthenticated && db) {
              try {
                if (isStarred) {
                  await db.unstarClass(classInfo);
                  unstarClass(dispatch)(classInfo);
                } else {
                  const starredClass = {
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
