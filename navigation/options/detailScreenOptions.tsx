import React, { useState } from "react";
import { Icon, Button, theme, HStack } from "native-base";
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
import { useClassInfoLoader, useSemester } from "../../libs/hooks";
import { getFullClassCode, extractClassInfo } from "../../libs/utils";
import { useAuth } from "../../mongodb/auth";
import Action from "../../redux/actions";
import SharingButton from "../../components/SharingButton";
import { IconButton } from "../../components/LinkCompatibleButton";

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
    const starredClassRecord = useSelector((state) => state.starredClassRecord);
    const settings = useSelector((state) => state.settings);
    const {
      user,
      isAuthenticated,
      db,
      isSettingsSettled,
      setIsSemesterSettled,
    } = useAuth();
    const semesterInfo = useSemester({
      params: route.params,
      settings,
      isSettingsSettled,
      setIsSemesterSettled,
    });
    const { classInfo } = useClassInfoLoader({
      classCode,
      semester: semesterInfo,
      isSemesterSettled: false,
      isSettingsSettled: false,
      starredClassRecord,
    });
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const isStarred =
      isAuthenticated &&
      starredClassRecord &&
      !!starredClassRecord[getFullClassCode(classCode)];

    return (
      <>
        <AlertPopup
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          header={
            isAuthenticated
              ? `Unable to ${isStarred ? "Unstar" : "Star"}`
              : "Sign In to Star"
          }
          body={
            isAuthenticated
              ? undefined
              : "You need to sign in to keep track of your starred classes."
          }
          footerPrimaryButton={
            isAuthenticated
              ? undefined
              : (isCompact) => (
                  <Button
                    borderRadius={isCompact ? 8 : undefined}
                    py={isCompact ? "5px" : "8px"}
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
        <HStack>
          <IconButton
            disabled={!classInfo}
            isDisabled={!classInfo}
            marginRight={"5px"}
            padding={"5px"}
            icon={
              <Icon
                color={isStarred ? theme.colors.yellow[400] : undefined}
                as={<Ionicons name={"star" + (isStarred ? "" : "-outline")} />}
              />
            }
            onPress={async () => {
              if (user && isAuthenticated && db) {
                try {
                  if (isStarred) {
                    await db.unstarClass(classCode);
                    Action.unstarClass(dispatch)(classCode);
                  } else if (classInfo) {
                    const starredClass: StarredClassInfo = {
                      ...extractClassInfo(classInfo),
                      starredDate: Date.now(),
                    };
                    await db.starClass(starredClass);
                    Action.starClass(dispatch)(starredClass);
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
          <SharingButton />
        </HStack>
      </>
    );
  },
});
