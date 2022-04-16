import React, { useEffect, useMemo, useState } from "react";
import { Text, Button, Box, VStack, Skeleton } from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import type { ReviewRecord, SharedNavigationParamList } from "../../libs/types";
import { getDepartmentName, getSchoolName } from "../../libs/utils";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import ReviewCard from "../../components/ReviewCard";
import { useAuth } from "../../mongodb/auth";
import { useDB } from "../../mongodb/db";
import AlertPopup from "../../components/AlertPopup";
import { reviewClass, unreviewClass } from "../../redux/actions";

type DetailScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Detail"
>;

type DetailScreenRouteProp = RouteProp<SharedNavigationParamList, "Detail">;

export default function DetailScreen() {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const { classInfo, deleteReview, newReview } = route.params;
  const dispatch = useDispatch();
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

  const myReview = useMemo(() => {
    return (
      (!!auth.user &&
        auth.isAuthenticated &&
        !!reviewRecord &&
        reviewRecord[auth.user.id]) ||
      undefined
    );
  }, [auth, reviewRecord]);

  const db = useMemo(() => {
    if (auth.user) return useDB(auth.user);
  }, [auth.user]);

  useEffect(() => {
    if (!reviewRecord && db) {
      const loadReviewDoc = async () => {
        try {
          const reviewRecord: ReviewRecord =
            (await db.loadReviewDoc(classInfo)) ?? {};
          delete reviewRecord["_id"];
          setReviewRecord(reviewRecord);
        } catch (e) {
          setShowAlert(true);
        }
      };
      loadReviewDoc();
    }
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
    (async () => {
      if (isFocused && auth.user && auth.isAuthenticated) {
        try {
          if (deleteReview) {
            await db?.deleteReview(classInfo);
            await unreviewClass(dispatch, auth.user)(classInfo);

            if (reviewRecord) {
              const newReviewRecord = { ...reviewRecord };
              delete newReviewRecord[auth.user.id];
              setReviewRecord(newReviewRecord);
            }

            navigation.setParams({ deleteReview: undefined });
          } else if (newReview) {
            if (myReview) {
              await db?.updateReview(classInfo, newReview);
            } else {
              await db?.submitReview(classInfo, newReview);
              await reviewClass(dispatch, auth.user)(classInfo);
            }

            if (reviewRecord) {
              const newReviewRecord = { ...reviewRecord };
              newReviewRecord[auth.user.id] = newReview;
              setReviewRecord(newReviewRecord);
            }

            navigation.setParams({ newReview: undefined });
          }
        } catch (e) {
          setShowAlert(true);
        }
      }
    })();
  }, [isFocused, auth.user]);

  return (
    <>
      <AlertPopup
        header={reviewRecord ? "Unable to Review" : "Unable to Load Reviews"}
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
          {!!description && (
            <Text fontSize={"md"} margin={"10px"}>
              {description}
            </Text>
          )}
          <Button
            margin={"10px"}
            onPress={() => {
              if (auth.user && auth.isAuthenticated) {
                navigation.navigate("Review", {
                  classInfo,
                  previousReview: myReview,
                });
              } else {
                navigation.navigate("SignInSignUp");
              }
            }}
          >
            <Text variant={"button"}>
              {auth.user && auth.isAuthenticated
                ? myReview
                  ? "Edit My Review"
                  : "Review"
                : "Sign Up to Review"}
            </Text>
          </Button>
          <VStack margin={"10px"} space={"10px"}>
            {reviewRecord
              ? reviewerIds.map((id) => (
                  <ReviewCard
                    key={id}
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
          </VStack>
        </Box>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
