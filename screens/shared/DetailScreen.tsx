import React, { useMemo, useState } from "react";
import { Text, Button, Box, VStack, HStack, Spacer } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type { Review, SharedNavigationParamList } from "../../libs/types";
import {
  getDepartmentName,
  getSchoolName,
  placeholderReview,
} from "../../libs/utils";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import ReviewCard from "../../components/ReviewCard";
import { useAuth } from "../../mongodb/auth";

type DetailScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Detail"
>;

type DetailScreenRouteProp = RouteProp<SharedNavigationParamList, "Detail">;

export default function DetailScreen() {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const { classInfo } = route.params;
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const description = useMemo(() => {
    return (
      classInfo.description &&
      classInfo.description.replace(/([a-z0-9])[\s\n]+([^\s\n])/gi, "$1 $2")
    );
  }, [classInfo.description]);
  const auth = useAuth();
  const [review1, setReview1] = useState({ ...placeholderReview });
  const [review2, setReview2] = useState({ ...placeholderReview });
  const [review3, setReview3] = useState({ ...placeholderReview });

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        <Text variant={"h1"}>{classInfo.name}</Text>
        <Text variant={"h2"}>
          {getSchoolName(classInfo, schoolNames)}
          {": "}
          {getDepartmentName(classInfo, departmentNames)}
        </Text>
        {description && (
          <Text fontSize={"md"} margin={"10px"}>
            {description}
          </Text>
        )}
        <Button
          margin={"10px"}
          onPress={() => {
            if (auth.isAuthenticated) {
              navigation.navigate("Review", { classInfo });
            } else {
              navigation.navigate("SignInSignUp");
            }
          }}
        >
          <Text variant={"button"}>
            {auth.isAuthenticated ? "Review" : "Sign Up to Review"}
          </Text>
        </Button>
        <VStack margin={"10px"} space={"10px"}>
          <ReviewCard review={review1} setReview={setReview1} />
          <ReviewCard review={review2} setReview={setReview2} />
          <ReviewCard review={review3} setReview={setReview3} />
        </VStack>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
