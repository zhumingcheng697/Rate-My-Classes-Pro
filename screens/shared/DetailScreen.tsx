import React, { useEffect, useMemo, useState } from "react";
import { Text, Button, Box, VStack, Skeleton, ZStack } from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import type {
  ReviewRecord,
  SectionInfo,
  SharedNavigationParamList,
} from "../../libs/types";
import {
  getDepartmentName,
  getSchoolName,
  stripLineBreaks,
} from "../../libs/utils";
import Semester from "../../libs/semester";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import AlertPopup from "../../components/AlertPopup";
import ReviewCard from "../../components/ReviewCard";
import RatingDashboard from "../../components/RatingDashboard";
import { useAuth } from "../../mongodb/auth";
import { useDB } from "../../mongodb/db";
import { reviewClass, unreviewClass } from "../../redux/actions";
import { getSections } from "../../libs/schedge";

type DetailScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Detail"
>;

enum DetailScreenErrorType {
  loadReviews = "LOAD_REVIEWS",
  loadSchedule = "LOAD_SCHEDULE",
  upsertReview = "UPSERT_REVIEW",
}

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
  const { selectedSemester } = useSelector((state) => state.settings);

  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<DetailScreenErrorType | null>(null);

  const [sections, setSections] = useState<SectionInfo[] | null>(null);
  const [previousSemester, setPreviousSemester] = useState(
    new Semester(selectedSemester)
  );
  const [reviewRecord, setReviewRecord] = useState<ReviewRecord | null>(null);

  const description = useMemo(() => {
    return classInfo.description
      ? stripLineBreaks(classInfo.description).split(/\n/)
      : undefined;
  }, [classInfo.description]);

  const myReview = useMemo(() => {
    return (
      (!!auth.user &&
        auth.isAuthenticated &&
        !!reviewRecord &&
        reviewRecord[auth.user.id]) ||
      undefined
    );
  }, [auth, reviewRecord]);

  const rating = useMemo(() => {
    if (!reviewRecord) return;

    let enjoyment = 0;
    let difficulty = 0;
    let workload = 0;
    let value = 0;

    let count = 0;

    for (let review of Object.values(reviewRecord)) {
      enjoyment += review.enjoyment;
      difficulty += review.difficulty;
      workload += review.workload;
      value += review.value;
      ++count;
    }

    if (count == 0) {
      return;
    }

    enjoyment /= count;
    difficulty /= count;
    workload /= count;
    value /= count;

    return { enjoyment, difficulty, workload, value };
  }, [reviewRecord]);

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
          setError(DetailScreenErrorType.loadReviews);
          setShowAlert(true);
        }
      };
      loadReviewDoc();
    }
  }, [db]);

  useEffect(() => {
    let semester = new Semester(selectedSemester);
    if (!Semester.equals(semester, previousSemester)) {
      setPreviousSemester(semester);
    } else if (sections) {
      return;
    }

    getSections(classInfo, selectedSemester)
      .then((sections) => {
        setSections(sections);
      })
      .catch(() => {
        setSections(null);
        setError(DetailScreenErrorType.loadSchedule);
        setShowAlert(true);
      });
  }, [selectedSemester]);

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
      if (isFocused && auth.user && auth.isAuthenticated && db) {
        try {
          if (deleteReview) {
            await db.deleteReview(classInfo);
            await db.unreviewClass(classInfo);
            unreviewClass(dispatch)(classInfo);

            if (reviewRecord) {
              const newReviewRecord = { ...reviewRecord };
              delete newReviewRecord[auth.user.id];
              setReviewRecord(newReviewRecord);
            }
          } else if (newReview) {
            if (myReview) {
              await db.updateReview(classInfo, newReview);
            } else {
              const reviewedClass = { ...classInfo, reviewedDate: Date.now() };
              await db.submitReview(classInfo, newReview);
              await db.reviewClass(reviewedClass);
              reviewClass(dispatch)(reviewedClass);
            }

            if (reviewRecord) {
              const newReviewRecord = { ...reviewRecord };
              newReviewRecord[auth.user.id] = newReview;
              setReviewRecord(newReviewRecord);
            }
          }
        } catch (e) {
          setError(DetailScreenErrorType.upsertReview);
          setShowAlert(true);
        } finally {
          navigation.setParams({
            deleteReview: undefined,
            newReview: undefined,
          });
        }
      }
    })();
  }, [isFocused, auth.user]);

  return (
    <>
      <AlertPopup
        header={
          error === DetailScreenErrorType.loadReviews
            ? "Unable to Load Reviews"
            : error === DetailScreenErrorType.loadSchedule
            ? "Unable to Load Schedule"
            : "Unable to Review"
        }
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
            <VStack margin={"10px"} space={"5px"}>
              {description.map((text, index) => (
                <Text fontSize={"md"} key={"description" + index}>
                  {text}
                </Text>
              ))}
            </VStack>
          )}
          {!!rating && (
            <RatingDashboard
              margin={"5px"}
              enjoyment={rating.enjoyment}
              difficulty={rating.difficulty}
              workload={rating.workload}
              value={rating.value}
            />
          )}
          <VStack margin={"10px"} space={"10px"}>
            {sections ? (
              <Button
                variant={"subtle"}
                isDisabled={!sections || !sections.length}
                onPress={() => {
                  navigation.navigate("Schedule", {
                    semester: selectedSemester,
                    sections: sections ?? [],
                    classInfo,
                  });
                }}
              >
                <Text variant={"subtleButton"}>
                  {!sections || sections.length
                    ? `View ${new Semester(
                        selectedSemester
                      ).toString()} Schedule`
                    : `Not Offered in ${new Semester(
                        selectedSemester
                      ).toString()}`}
                </Text>
              </Button>
            ) : (
              <ZStack
                height={"40px"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Skeleton borderRadius={10}></Skeleton>
                <Text variant={"subtleButton"} opacity={0.5}>
                  Loading {new Semester(selectedSemester).toString()} Schedule
                </Text>
              </ZStack>
            )}
            <Button
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
                  : "Sign In to Review"}
              </Text>
            </Button>
          </VStack>
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
