import React, { useEffect, useMemo, useState } from "react";
import { Text, Button, Box, VStack, Skeleton } from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type { ReviewRecord, SharedNavigationParamList } from "../../libs/types";
import {
  getDepartmentName,
  getSchoolName,
  placeholderReview,
} from "../../libs/utils";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import ReviewCard from "../../components/ReviewCard";
import { useAuth } from "../../mongodb/auth";
import { useDB } from "../../mongodb/db";
import AlertPopup from "../../components/AlertPopup";

type DetailScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Detail"
>;

type DetailScreenRouteProp = RouteProp<SharedNavigationParamList, "Detail">;

export default function DetailScreen() {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const { classInfo, deleteReview, newReview } = route.params;
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const auth = useAuth();
  const isFocused = useIsFocused();
  const description = useMemo(() => {
    return (
      classInfo.description &&
      classInfo.description.replace(/([a-z0-9])[\s\n]+([^\s\n])/gi, "$1 $2")
    );
  }, [classInfo.description]);

  const [showAlert, setShowAlert] = useState(false);

  const [reviewRecord, setReviewRecord] = useState<ReviewRecord | null>(null);

  const [review1, setReview1] = useState({ ...placeholderReview });
  const [review2, setReview2] = useState({ ...placeholderReview });
  const [review3, setReview3] = useState({ ...placeholderReview });

  const db = useMemo(() => {
    if (auth.user && auth.isAuthenticated) return useDB(auth.user);
  }, [auth.user]);

  useEffect(() => {
    // if (!reviewRecord && db) {
    //   const loadReviewDoc = async () => {
    //     try {
    //       const reviewRecord: ReviewRecord =
    //         (await db.loadReviewDoc(classInfo)) ?? {};
    //       delete reviewRecord["_id"];
    //       setReviewRecord(reviewRecord);
    //     } catch (e) {
    //       setShowAlert(true);
    //     }
    //   };
    //   loadReviewDoc();
    // }
  }, [db]);

  const reviewerIds = useMemo(() => {
    if (!reviewRecord) return [];

    return Object.keys(reviewRecord).sort(
      (a, b) =>
        (reviewRecord[b]?.reviewedDate ?? 0) -
        (reviewRecord[a]?.reviewedDate ?? 0)
    );
  }, [reviewRecord]);

  useEffect(() => {
    if (isFocused && auth.user && auth.isAuthenticated) {
      if (deleteReview) {
        console.log("delete");

        // db?.deleteReview(classInfo);
        navigation.setParams({ deleteReview: undefined });
      } else if (newReview) {
        console.log("new");

        // db?.upsertReview(classInfo, newReview);
        navigation.setParams({ newReview: undefined });
      }
    }
  }, [isFocused, auth.user]);

  return (
    <>
      <AlertPopup
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
        }}
      />
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
              if (auth.user && auth.isAuthenticated) {
                if (reviewRecord) {
                  const review = reviewRecord[auth.user.id];
                  navigation.navigate("Review", {
                    classInfo,
                    previousReview: review,
                  });
                } else {
                  navigation.navigate("Review", { classInfo });
                }
              } else {
                navigation.navigate("SignInSignUp");
              }
            }}
          >
            <Text variant={"button"}>
              {auth.user && auth.isAuthenticated
                ? reviewRecord && reviewRecord[auth.user.id]
                  ? "Edit My Review"
                  : "Review"
                : "Sign Up to Review"}
            </Text>
          </Button>
          <VStack margin={"10px"} space={"10px"}>
            {reviewRecord
              ? reviewerIds.map((id) => (
                  <ReviewCard
                    classCode={classInfo}
                    review={reviewRecord[id]}
                    setReview={(newReview) => {
                      const newReviewRecord = { ...reviewRecord };
                      newReviewRecord[id] = newReview;
                      setReviewRecord(newReviewRecord);
                    }}
                  />
                ))
              : [...Array(3)].map((_, index) => (
                  <Skeleton borderRadius={10} height={"120px"} key={index} />
                ))}
            <ReviewCard
              classCode={classInfo}
              review={review1}
              setReview={setReview1}
            />
            <ReviewCard
              classCode={classInfo}
              review={review2}
              setReview={setReview2}
            />
            <ReviewCard
              classCode={classInfo}
              review={review3}
              setReview={setReview3}
            />
          </VStack>
        </Box>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
