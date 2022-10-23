import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, Box, VStack, Skeleton } from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import {
  ErrorType,
  ReviewOrder,
  type ReviewRecord,
  type SectionInfo,
  type SharedNavigationParamList,
} from "../../libs/types";
import {
  compareReviews,
  extractClassInfo,
  getDepartmentName,
  getFullClassCode,
  getSchoolName,
  notOfferedMessage,
  Route,
  stripLineBreaks,
} from "../../libs/utils";
import Semester from "../../libs/semester";
import { getSections } from "../../libs/schedge";
import {
  useClassInfoLoader,
  useInitialTabName,
  useRefresh,
} from "../../libs/hooks";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import AlertPopup from "../../components/AlertPopup";
import ReviewCard from "../../components/ReviewCard";
import RatingDashboard from "../../components/RatingDashboard";
import {
  SolidButton,
  SubtleButton,
} from "../../components/LinkCompatibleButtons";
import { ReviewOrderSelector } from "../../components/Selector";
import { useAuth } from "../../mongodb/auth";
import { reviewClass, unreviewClass } from "../../redux/actions";

type DetailScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Detail"
>;

enum ReviewErrorType {
  submitReview = "Submit Your Review",
  updateReview = "Update Your Review",
  deleteReview = "Delete Your Review",
}

type DetailScreenRouteProp = RouteProp<SharedNavigationParamList, "Detail">;

export default function DetailScreen() {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const { classCode, deleteReview, newReview, starredOrReviewed, query } =
    route.params;
  const dispatch = useDispatch();
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const { user, isAuthenticated, isSettingsSettled, db, signInAnonymously } =
    useAuth();
  const isFocused = useIsFocused();
  const { selectedSemester } = useSelector((state) => state.settings);
  const tabName = useInitialTabName();

  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<ReviewErrorType | null>(null);
  const [scheduleError, setScheduleError] = useState(false);
  const [reviewError, setReviewError] = useState(false);

  const [sections, setSections] = useState<SectionInfo[] | null>(null);
  const [previousSemester, setPreviousSemester] = useState(
    new Semester(selectedSemester)
  );
  const [reviewRecord, setReviewRecord] = useState<ReviewRecord | null>(null);

  const [reviewOrder, setReviewOrder] = useState(
    ReviewOrder.mostRecentSemester
  );

  const semesterName = useMemo(
    () => new Semester(selectedSemester).toString(),
    [selectedSemester]
  );

  const myReview = useMemo(() => {
    return (
      (!!user && isAuthenticated && !!reviewRecord && reviewRecord[user.id]) ||
      undefined
    );
  }, [user, isAuthenticated, reviewRecord]);

  const [enjoyment, difficulty, workload, value] = useMemo(() => {
    if (!reviewRecord) return [null, null, null, null];

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
      return [NaN, NaN, NaN, NaN];
    }

    enjoyment /= count;
    difficulty /= count;
    workload /= count;
    value /= count;

    return [enjoyment, difficulty, workload, value];
  }, [reviewRecord]);

  useEffect(() => {
    if (!user) {
      signInAnonymously();
    }
  }, [user]);

  const { classInfo, classInfoError, reloadClassInfo } = useClassInfoLoader(
    classCode,
    selectedSemester,
    isSettingsSettled
  );

  const description = useMemo(() => {
    return classInfo?.description
      ? stripLineBreaks(classInfo?.description).split(/\n/)
      : undefined;
  }, [classInfo?.description]);

  useEffect(() => {
    if (
      !error &&
      !classInfoError &&
      !scheduleError &&
      !reviewError &&
      showAlert
    ) {
      setShowAlert(false);
    }
  }, [error, classInfoError, scheduleError, reviewError, showAlert]);

  const semester = new Semester(selectedSemester);

  const fetchReviews = useCallback(
    (failSilently: boolean = false) => {
      if (!reviewRecord && db) {
        (async () => {
          try {
            const reviewRecord: ReviewRecord =
              (await db.loadReviewDoc(classCode)) ?? {};
            delete reviewRecord["_id"];
            setReviewRecord(reviewRecord);
            setReviewError(false);
          } catch (e) {
            setReviewError(true);
            if (!failSilently) setShowAlert(true);
          }
        })();
      }
    },
    [reviewRecord, db, classCode]
  );

  useEffect(fetchReviews, [db]);

  useEffect(() => {
    if (!classInfo && classInfoError) {
      setShowAlert(true);
    } else if (classInfo && !classCode.name) {
      navigation.setParams({ classCode: classInfo });
    }
  }, [classInfo, classInfoError]);

  const fetchSections = useCallback(
    (failSilently: boolean = false) => {
      if (!isSettingsSettled || !classInfo) return;

      if (!Semester.equals(semester, previousSemester)) {
        setPreviousSemester(semester);
      } else if (sections) {
        return;
      }

      getSections(classInfo, selectedSemester)
        .then((sections) => {
          setSections(sections);
          setScheduleError(false);
        })
        .catch(() => {
          setSections(null);
          setScheduleError(true);
          if (!failSilently) setShowAlert(true);
        });
    },
    [
      isSettingsSettled,
      classInfo,
      semester,
      previousSemester,
      sections,
      selectedSemester,
    ]
  );

  useEffect(fetchSections, [selectedSemester, isSettingsSettled, classInfo]);

  const reviewerIds = useMemo(() => {
    if (!reviewRecord) return [];

    return Object.keys(reviewRecord).sort((a, b) =>
      compareReviews(reviewOrder)(reviewRecord[a], reviewRecord[b])
    );
  }, [reviewRecord, reviewOrder]);

  useEffect(() => {
    (async () => {
      if (
        isFocused &&
        user &&
        isAuthenticated &&
        db &&
        (deleteReview || newReview)
      ) {
        try {
          if (deleteReview) {
            await db.deleteReview(classCode);
            await db.unreviewClass(classCode);
            unreviewClass(dispatch)(classCode);

            if (reviewRecord) {
              const newReviewRecord = { ...reviewRecord };
              delete newReviewRecord[user.id];
              setReviewRecord(newReviewRecord);
            }
          } else if (newReview) {
            if (myReview) {
              await db.updateReview(classCode, newReview);
            } else if (classInfo) {
              const reviewedClass = {
                ...extractClassInfo(classInfo),
                reviewedDate: Date.now(),
              };
              await db.submitReview(classCode, newReview);
              await db.reviewClass(reviewedClass);
              reviewClass(dispatch)(reviewedClass);
            } else {
              setError(ReviewErrorType.submitReview);
            }

            if (reviewRecord) {
              const newReviewRecord = { ...reviewRecord };
              newReviewRecord[user.id] = newReview;
              setReviewRecord(newReviewRecord);
            }
          }
        } catch (e) {
          if (deleteReview) {
            setError(ReviewErrorType.deleteReview);
          } else if (newReview) {
            if (myReview) {
              setError(ReviewErrorType.updateReview);
            } else {
              setError(ReviewErrorType.submitReview);
            }
          } else {
            return;
          }
          setShowAlert(true);
        } finally {
          navigation.setParams({
            deleteReview: undefined,
            newReview: undefined,
          });
        }
      }
    })();
  }, [isFocused, user]);

  useRefresh((reason) => {
    const failSilently = reason === "NetInfo";
    reloadClassInfo?.(failSilently);
    fetchReviews(failSilently);
    fetchSections(failSilently);
  });

  return (
    <>
      <AlertPopup
        header={"Not Offered"}
        body={notOfferedMessage(classCode, classInfo, semester)}
        isOpen={showAlert && classInfoError === ErrorType.noData}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
      <AlertPopup
        autoDismiss
        isOpen={showAlert && classInfoError === ErrorType.network}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
      <AlertPopup
        autoDismiss
        header={"Unable to Load Schedule or Review"}
        isOpen={showAlert && !classInfoError && scheduleError && reviewError}
        onClose={() => setShowAlert(false)}
      />
      <AlertPopup
        autoDismiss
        header={"Unable to Load Schedule"}
        isOpen={showAlert && !classInfoError && scheduleError && !reviewError}
        onClose={() => setShowAlert(false)}
      />
      <AlertPopup
        autoDismiss
        header={"Unable to Load Review"}
        isOpen={showAlert && !classInfoError && !scheduleError && reviewError}
        onClose={() => setShowAlert(false)}
      />
      {[
        ReviewErrorType.submitReview,
        ReviewErrorType.updateReview,
        ReviewErrorType.deleteReview,
      ].map((e) => (
        <AlertPopup
          key={e}
          header={`Unable to ${e}`}
          isOpen={
            showAlert &&
            error === e &&
            !classInfoError &&
            !scheduleError &&
            !reviewError
          }
          onClose={() => setShowAlert(false)}
        />
      ))}
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"} opacity={classInfo || classInfoError ? 1 : 0.5}>
            {classInfo?.name ?? getFullClassCode(classCode)}
          </Text>
          <Text
            variant={"h2"}
            opacity={schoolNames && departmentNames ? 1 : 0.5}
          >
            {getSchoolName(classCode, schoolNames)}
            {": "}
            {getDepartmentName(classCode, departmentNames)}
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
          <RatingDashboard
            margin={"5px"}
            loadError={classInfoError === ErrorType.network || reviewError}
            enjoyment={enjoyment}
            difficulty={difficulty}
            workload={workload}
            value={value}
          />
          <VStack margin={"10px"} space={"10px"}>
            <SubtleButton
              isDisabled={!sections || !sections.length}
              linkTo={Route(tabName, "Schedule", {
                semester: selectedSemester,
                sections: sections ?? undefined,
                classCode: classInfo ?? classCode,
                starredOrReviewed,
                query,
              })}
            >
              <Text variant={"subtleButton"}>
                {sections
                  ? sections.length
                    ? `View ${semesterName} Schedule`
                    : `Not Offered in ${semesterName}`
                  : classInfoError === ErrorType.noData
                  ? `Not Offered in ${semesterName}`
                  : classInfoError === ErrorType.network || scheduleError
                  ? "Unable to Load Schedule"
                  : `Loading${
                      isSettingsSettled ? ` ${semesterName} ` : " "
                    }Schedule`}
              </Text>
            </SubtleButton>
            <SolidButton
              isDisabled={!classInfo || !reviewRecord}
              linkTo={
                user && isAuthenticated
                  ? Route(tabName, "Review", {
                      classCode: classInfo ?? classCode,
                      previousReview: myReview,
                      starredOrReviewed,
                      newOrEdit: myReview ? "Edit" : "New",
                      query,
                    })
                  : Route(tabName, "SignInSignUp", {
                      classCode: classInfo ?? classCode,
                      starredOrReviewed,
                      query,
                    })
              }
            >
              <Text variant={"button"}>
                {user && isAuthenticated
                  ? myReview
                    ? "Edit My Review"
                    : "Review"
                  : "Sign In to Review"}
              </Text>
            </SolidButton>
          </VStack>
          {(!reviewRecord || !!reviewerIds.length) && (
            <VStack margin={"10px"} marginBottom={"5px"} space={"10px"}>
              {!!reviewRecord && reviewerIds.length > 1 && (
                <ReviewOrderSelector
                  selectedReviewOrder={reviewOrder}
                  onSelectedReviewOrderChange={setReviewOrder}
                />
              )}
              {reviewRecord
                ? reviewerIds.map((id) => (
                    <ReviewCard
                      key={id}
                      classInfo={classInfo ?? undefined}
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
          )}
        </Box>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
