import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Box, Button, Input, Text, VStack } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import LabeledInput from "../../components/LabeledInput";
import { RatingSelector, SemesterSelector } from "../../components/Selector";
import { LeftAlignedButton } from "../../components/LinkCompatibleButton";
import AlertPopup from "../../components/AlertPopup";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import {
  type SharedNavigationParamList,
  type Rating,
  type Review,
  type ReviewRecord,
  RatingType,
  ErrorType,
} from "../../libs/types";
import {
  getFullClassCode,
  hasEditedReview,
  notOfferedMessage,
} from "../../libs/utils";
import {
  useClassInfoLoader,
  useIsCurrentRoute,
  useRefresh,
  useSemester,
} from "../../libs/hooks";
import Semester from "../../libs/semester";
import { useAuth } from "../../mongodb/auth";

type ReviewScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Review"
>;

type ReviewScreenRouteProp = RouteProp<SharedNavigationParamList, "Review">;

export default function ReviewScreen() {
  const { user, isSettingsSettled, isVerified, db } = useAuth();
  const navigation = useNavigation<ReviewScreenNavigationProp>();
  const route = useRoute<ReviewScreenRouteProp>();
  const starredClassRecord = useSelector((state) => state.starredClassRecord);
  const reviewedClassRecord = useSelector((state) => state.reviewedClassRecord);
  const { params, key } = route;
  const settings = useSelector((state) => state.settings);
  const { classCode, previousReview, newOrEdit } = params;
  const [hasEdited, setHasEdited] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [willDelete, setWillDelete] = useState(false);
  const isCurrentRoute = useIsCurrentRoute(key);
  const semesterInfo = useSemester({
    db,
    navigation,
    params,
    settings,
    isSettingsSettled,
  });
  const { classInfo, classInfoError, reloadClassInfo } = useClassInfoLoader({
    classCode,
    semester: semesterInfo,
    isSemesterSettled:
      (isSettingsSettled || !!params.semester) && !!user && isVerified,
    isSettingsSettled: isSettingsSettled && !!user && isVerified,
    starredClassRecord,
    reviewedClassRecord,
  });

  const [enjoyment, setEnjoyment] = useState<Rating | undefined>(
    previousReview?.enjoyment
  );
  const [difficulty, setDifficulty] = useState<Rating | undefined>(
    previousReview?.difficulty
  );
  const [workload, setWorkload] = useState<Rating | undefined>(
    previousReview?.workload
  );
  const [value, setValue] = useState<Rating | undefined>(previousReview?.value);
  const [semester, setSemester] = useState<Semester | undefined>(
    previousReview ? new Semester(previousReview.semester) : undefined
  );
  const [instructor, setInstructor] = useState(
    previousReview?.instructor ?? ""
  );
  const [comment, setComment] = useState(previousReview?.comment ?? "");
  const [reviewError, setReviewError] = useState(false);

  const semesterOptions = useMemo(
    () =>
      previousReview
        ? [new Semester(previousReview.semester)]
        : Semester.getSemesterOptions(false, 12).reverse(),
    [previousReview]
  );

  const fetchMyReview = useCallback(
    (failSilently: boolean = false) => {
      if (classInfo && !previousReview && newOrEdit !== "New" && db) {
        const loadMyReview = async () => {
          if (isVerified && user && !previousReview) {
            try {
              const reviewRecord: ReviewRecord =
                (await db.loadReviewDoc(classCode)) ?? {};
              const review: Review | undefined = reviewRecord[user.id];
              if (review) {
                setEnjoyment(review.enjoyment);
                setDifficulty(review.difficulty);
                setWorkload(review.workload);
                setValue(review.value);
                setSemester(new Semester(review.semester));
                setInstructor(review.instructor);
                setComment(review.comment);
                navigation.setParams({
                  previousReview: review,
                  newOrEdit: "Edit",
                });
              } else {
                navigation.setParams({ newOrEdit: "New" });
              }
            } catch (e) {
              setReviewError(true);
              if (!failSilently) setShowAlert(true);
            }
          }
        };
        loadMyReview();
      } else if (!classInfo && classInfoError) {
        setShowAlert(true);
      }
    },
    [
      db,
      classInfo,
      previousReview,
      newOrEdit,
      isVerified,
      user,
      classCode,
      navigation,
      classInfoError,
    ]
  );

  useEffect(fetchMyReview, [classInfo, classInfoError, db]);

  useEffect(() => {
    if (!isVerified && isCurrentRoute) {
      navigation.goBack();
      return;
    }

    if (
      newOrEdit &&
      user &&
      enjoyment &&
      difficulty &&
      workload &&
      value &&
      semester &&
      instructor
    ) {
      if (
        hasEdited ||
        hasEditedReview(
          previousReview,
          enjoyment,
          difficulty,
          workload,
          value,
          comment
        )
      ) {
        setHasEdited(true);
        navigation.setParams({
          newReview: {
            userId: user.id,
            enjoyment,
            difficulty,
            workload,
            value,
            upvotes: previousReview?.upvotes ?? { [user.id]: true },
            downvotes: previousReview?.downvotes ?? {},
            reviewedDate: previousReview?.reviewedDate ?? Date.now(),
            semester: semester.toJSON(),
            instructor,
            comment,
          },
        });
      }
    } else if (params.newReview) {
      navigation.setParams({ newReview: undefined });
    }
  }, [
    enjoyment,
    difficulty,
    workload,
    value,
    semester,
    instructor,
    comment,
    isVerified,
    newOrEdit,
    isCurrentRoute,
  ]);

  useEffect(() => {
    if (showAlert && !classInfoError && !reviewError && !willDelete) {
      setShowAlert(false);
    }
  }, [classInfoError, reviewError, willDelete, showAlert]);

  useRefresh((reason) => {
    const failSilently = reason === "NetInfo";
    reloadClassInfo?.(failSilently);
    fetchMyReview(failSilently);
  });

  return (
    <>
      <AlertPopup
        isOpen={showAlert && willDelete}
        onClose={() => setShowAlert(false)}
        header={"Delete Review"}
        body={
          "You are about to delete your review. This action is not reversable!"
        }
        footerPrimaryButton={
          <Button
            variant={"dangerous"}
            onPress={() => {
              setShowAlert(false);
              setWillDelete(false);
              navigation.navigate("Detail", {
                classCode: classInfo ?? classCode,
                deleteReview: true,
                semester: semesterInfo,
              });
            }}
          >
            Delete
          </Button>
        }
      />
      <AlertPopup
        isOpen={
          showAlert &&
          !willDelete &&
          classInfoError === ErrorType.noData &&
          !reviewError
        }
        onClose={() => {
          setShowAlert(false);
          navigation.pop(2);
        }}
        header={"Unable to Review"}
        body={notOfferedMessage(classCode, classInfo, semesterInfo)}
      />
      <AlertPopup
        autoDismiss
        isOpen={
          showAlert &&
          !willDelete &&
          (classInfoError === ErrorType.network || reviewError)
        }
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
        header={"Unable to Review"}
      />
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"} opacity={classInfo?.name ? 1 : 0.5}>
            {classInfo?.name ?? (newOrEdit ? `${newOrEdit} Review"` : "Review")}
          </Text>
          <Text variant={"h2"}>{getFullClassCode(classCode)}</Text>
          <VStack marginX={"10px"} marginY={"5px"} space={"8px"}>
            <LabeledInput
              label={"Instructor"}
              isDisabled={!newOrEdit || !!previousReview}
              showRequiredIcon={!!newOrEdit && !previousReview}
            >
              <Input
                value={instructor}
                onChangeText={setInstructor}
                autoCapitalize={"words"}
                isDisabled={!newOrEdit || !!previousReview}
              />
            </LabeledInput>
            <LabeledInput
              label={"Semester"}
              isDisabled={!newOrEdit || !!previousReview}
              showRequiredIcon={!!newOrEdit && !previousReview}
            >
              <SemesterSelector
                selectedSemester={semester}
                semesterOptions={semesterOptions}
                onSelectedSemesterChange={setSemester}
                isDisabled={!newOrEdit || !!previousReview}
              />
            </LabeledInput>
            <LabeledInput
              label={"Enjoyment"}
              isDisabled={!newOrEdit}
              showRequiredIcon={!!newOrEdit && !previousReview}
            >
              <RatingSelector
                selectedRating={enjoyment}
                ratingType={RatingType.enjoyment}
                onSelectedRatingChange={setEnjoyment}
                isDisabled={!newOrEdit}
              />
            </LabeledInput>
            <LabeledInput
              label={"Difficulty"}
              isDisabled={!newOrEdit}
              showRequiredIcon={!!newOrEdit && !previousReview}
            >
              <RatingSelector
                selectedRating={difficulty}
                ratingType={RatingType.difficulty}
                onSelectedRatingChange={setDifficulty}
                isDisabled={!newOrEdit}
              />
            </LabeledInput>
            <LabeledInput
              label={"Workload"}
              isDisabled={!newOrEdit}
              showRequiredIcon={!!newOrEdit && !previousReview}
            >
              <RatingSelector
                selectedRating={workload}
                ratingType={RatingType.workload}
                onSelectedRatingChange={setWorkload}
                isDisabled={!newOrEdit}
              />
            </LabeledInput>
            <LabeledInput
              label={"Value"}
              isDisabled={!newOrEdit}
              showRequiredIcon={!!newOrEdit && !previousReview}
            >
              <RatingSelector
                selectedRating={value}
                ratingType={RatingType.value}
                onSelectedRatingChange={setValue}
                isDisabled={!newOrEdit}
              />
            </LabeledInput>
            <LabeledInput label={"Comment"} isDisabled={!newOrEdit}>
              <Input
                placeholder={"Optional"}
                value={comment}
                onChangeText={setComment}
                multiline
                height={"130px"}
                isDisabled={!newOrEdit}
              />
            </LabeledInput>
            {previousReview && (
              <LeftAlignedButton
                title={"Delete"}
                showChevron={false}
                marginTop={"20px"}
                _text={{ variant: "dangerousSubtleButton" }}
                onPress={() => {
                  setWillDelete(true);
                  setShowAlert(true);
                }}
              />
            )}
          </VStack>
        </Box>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
