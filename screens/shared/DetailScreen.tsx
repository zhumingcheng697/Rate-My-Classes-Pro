import React from "react";
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
import Semester from "../../libs/semester";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { useAuth } from "../../mongodb/auth";
import PlainTextButton from "../../components/PlainTextButton";

type DetailScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Detail"
>;

type DetailScreenRouteProp = RouteProp<SharedNavigationParamList, "Detail">;

type ReviewCardProps = { review: Review };

function ReviewCard({ review }: ReviewCardProps) {
  const {
    instructor,
    semester,
    enjoyment,
    difficulty,
    workload,
    value,
    upvotes,
    downvotes,
    reviewedDate,
    comment,
  } = review;

  return (
    <VStack
      background={"background.secondary"}
      borderRadius={10}
      space={"5px"}
      padding={"10px"}
    >
      <Text fontSize={"lg"} fontWeight={"semibold"}>{`${new Semester(
        semester
      ).toString()} with ${instructor}`}</Text>
      <HStack flexWrap={"wrap"}>
        <HStack>
          <Text fontSize={"md"} fontWeight={"medium"}>
            {"Enjoyment: "}
          </Text>
          <Text fontSize={"md"}>{enjoyment} / 5</Text>
        </HStack>
        <Box minWidth={"25px"} />
        <HStack>
          <Text fontSize={"md"} fontWeight={"medium"}>
            {"Difficulty: "}
          </Text>
          <Text fontSize={"md"}>{difficulty} / 5</Text>
        </HStack>
        <Box minWidth={"25px"} />
        <HStack>
          <Text fontSize={"md"} fontWeight={"medium"}>
            {"Workload: "}
          </Text>
          <Text fontSize={"md"}>{workload} / 5</Text>
        </HStack>
        <Box minWidth={"25px"} />
        <HStack>
          <Text fontSize={"md"} fontWeight={"medium"}>
            {"Value: "}
          </Text>
          <Text fontSize={"md"}>{value} / 5</Text>
        </HStack>
      </HStack>
      {comment && <Text fontSize={"md"}>{comment}</Text>}
      <HStack justifyContent={"space-between"} flexWrap={"wrap"}>
        <PlainTextButton
          title={"Edit My Review"}
          _text={{ fontWeight: "semibold" }}
        />
        <Text>
          {new Date(reviewedDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </HStack>
    </VStack>
  );
}

export default function DetailScreen() {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const { classInfo } = route.params;
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const auth = useAuth();

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
          <ReviewCard review={placeholderReview} />
          <ReviewCard review={placeholderReview} />
          <ReviewCard review={placeholderReview} />
        </VStack>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
