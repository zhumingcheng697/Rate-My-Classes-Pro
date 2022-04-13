import React, { useState } from "react";
import { IconButton, Icon, Button } from "native-base";
import { useIsFocused, type RouteProp } from "@react-navigation/native";
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
    const isFocused = useIsFocused();
    const [showAlert, setShowAlert] = useState(false);
    const isStarred =
      auth.isAuthenticated &&
      starredClasses &&
      !!starredClasses[getFullClassCode(classInfo)];
    const pressedHoverStyle = { _icon: { opacity: 0.5 } };

    return (
      <>
        <AlertPopup
          isOpen={showAlert && isFocused}
          onClose={() => {
            setShowAlert(false);
          }}
          header={"Sign Up to Star"}
          body={"You need an account to keep track of your starred classes."}
          footer={(ref) => (
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                _pressed={{ opacity: 0.5 }}
                _hover={{ opacity: 0.5 }}
                onPress={() => {
                  setShowAlert(false);
                }}
                ref={ref}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  setShowAlert(false);
                  navigation.navigate("SignInSignUp");
                }}
              >
                Sign Up
              </Button>
            </Button.Group>
          )}
        />
        <IconButton
          variant={"unstyled"}
          marginRight={"5px"}
          padding={"5px"}
          _pressed={pressedHoverStyle}
          _hover={pressedHoverStyle}
          icon={
            <Icon
              color={isStarred ? "yellow.400" : "gray.300"}
              size={"22px"}
              as={<Ionicons name={"star" + (isStarred ? "" : "-outline")} />}
            />
          }
          onPress={() => {
            if (auth.user && auth.isAuthenticated) {
              if (isStarred) {
                unstarClass(dispatch, auth.user)(classInfo);
              } else {
                starClass(dispatch, auth.user)(classInfo);
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
