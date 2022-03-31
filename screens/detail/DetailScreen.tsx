import React from "react";
import { Text, Button, Box } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type {
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
} from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { getDepartmentName, getSchoolName } from "../../shared/utils";

type DetailScreenNavigationProp = StackNavigationProp<
  | ExploreNavigationParamList
  | SearchNavigationParamList
  | MeNavigationParamList,
  "Detail"
>;

type DetailScreenRouteProp = RouteProp<
  | ExploreNavigationParamList
  | SearchNavigationParamList
  | MeNavigationParamList,
  "Detail"
>;

export default function DetailScreen() {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const classInfo = route.params;
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        <Text variant={"h1"}>{classInfo.name}</Text>
        <Text variant={"h2"}>
          {getSchoolName(classInfo, schoolNames)}
          {": "}
          {getDepartmentName(classInfo, departmentNames)}
        </Text>
        {!!classInfo.description && (
          <Text fontSize={"md"} margin={"10px"}>
            {classInfo.description.replace(
              /([a-z0-9])[\s\n]+([^\s\n])/gi,
              "$1 $2"
            )}
          </Text>
        )}
        <Button
          margin={"10px"}
          onPress={() => {
            navigation.navigate("Review", classInfo);
          }}
        >
          <Text variant={"button"}>Review</Text>
        </Button>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
