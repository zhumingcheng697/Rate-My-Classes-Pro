import React, { useState, useMemo, useEffect } from "react";
import { Box, Button, Input, Text, theme, VStack } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import LabeledInput from "../../components/LabeledInput";
import { RatingSelector, SemesterSelector } from "../../components/Selector";
import LeftAlignedButton from "../../components/LeftAlignedButton";
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
import { useClassInfoLoader } from "../../libs/hooks";
import Semester from "../../libs/semester";
import { useAuth } from "../../mongodb/auth";
import { useDB } from "../../mongodb/db";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";

type ReviewScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Review"
>;

type ReviewScreenRouteProp = RouteProp<SharedNavigationParamList, "Review">;

export default function ReviewScreen() {
  const auth = useAuth();
  const navigation = useNavigation<ReviewScreenNavigationProp>();
  const route = useRoute<ReviewScreenRouteProp>();
  const { selectedSemester } = useSelector((state) => state.settings);
  const { classCode, previousReview } = route.params;
  const [hasEdited, setHasEdited] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { classInfo, classInfoError } = useClassInfoLoader(
    classCode,
    selectedSemester,
    auth.isSettingsSettled && !!auth.user
  );

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
        : Semester.getSemesterOptions(true, false, 12).reverse(),
    [previousReview]
  );

  const db = useMemo(() => {
    if (auth.user) return useDB(auth.user);
  }, [auth.user]);

  useEffect(() => {
    if (classInfo && !previousReview && db) {
      const loadMyReview = async () => {
        if (auth.isAuthenticated && auth.user && !previousReview) {
          try {
            const reviewRecord: ReviewRecord =
              (await db.loadReviewDoc(classCode)) ?? {};
            const review: Review | undefined = reviewRecord[auth.user.id];
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
              });
            }
          } catch (e) {
            setReviewError(true);
            setShowAlert(true);
          }
        }
      };
      loadMyReview();
    } else if (!classInfo && classInfoError) {
      setShowAlert(true);
    }
  }, [classInfo, classInfoError, db]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigation.goBack();
      return;
    }

    if (
      auth.user &&
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
            userId: auth.user.id,
            enjoyment,
            difficulty,
            workload,
            value,
            upvotes: previousReview?.upvotes ?? { [auth.user.id]: true },
            downvotes: previousReview?.downvotes ?? {},
            reviewedDate: previousReview?.reviewedDate ?? Date.now(),
            semester: semester.toJSON(),
            instructor,
            comment,
          },
        });
      }
    } else if (route.params.newReview) {
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
    auth.isAuthenticated,
  ]);

  return (
    <>
      <AlertPopup
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
          if (reviewError || classInfoError) {
            navigation.pop(classInfoError === ErrorType.noData ? 2 : 1);
          }
        }}
        header={
          reviewError || classInfoError ? "Unable to Review" : "Delete Review"
        }
        body={
          classInfoError === ErrorType.noData
            ? notOfferedMessage(classCode, classInfo, selectedSemester)
            : reviewError || classInfoError
            ? undefined
            : "You are about to delete your review. This action is not reversable."
        }
        footerPrimaryButton={
          reviewError || classInfoError ? undefined : (
            <Button
              {...colorModeResponsiveStyle((selector) => ({
                background: selector({
                  light: theme.colors.red[600],
                  dark: theme.colors.red[500],
                }),
              }))}
              onPress={() => {
                setShowAlert(false);
                navigation.navigate("Detail", {
                  classCode: classInfo ?? classCode,
                  deleteReview: true,
                });
              }}
            >
              Delete
            </Button>
          )
        }
      />
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"} opacity={classInfo?.name ? 1 : 0.5}>
            {classInfo?.name ?? "Review"}
          </Text>
          <Text variant={"h2"}>{getFullClassCode(classCode)}</Text>
          <VStack marginX={"10px"} marginY={"5px"} space={"8px"}>
            <LabeledInput
              label={"Instructor"}
              isDisabled={!!previousReview}
              showRequiredIcon={!previousReview}
            >
              <Input
                value={instructor}
                onChangeText={setInstructor}
                autoCapitalize={"words"}
                isDisabled={!!previousReview}
              />
            </LabeledInput>
            <LabeledInput
              label={"Semester"}
              isDisabled={!!previousReview}
              showRequiredIcon={!previousReview}
            >
              <SemesterSelector
                selectedSemester={semester}
                semesterOptions={semesterOptions}
                onSelectedSemesterChange={setSemester}
                isDisabled={!!previousReview}
              />
            </LabeledInput>
            <LabeledInput
              label={"Enjoyment"}
              showRequiredIcon={!previousReview}
            >
              <RatingSelector
                selectedRating={enjoyment}
                ratingType={RatingType.enjoyment}
                onSelectedRatingChange={setEnjoyment}
              />
            </LabeledInput>
            <LabeledInput
              label={"Difficulty"}
              showRequiredIcon={!previousReview}
            >
              <RatingSelector
                selectedRating={difficulty}
                ratingType={RatingType.difficulty}
                onSelectedRatingChange={setDifficulty}
              />
            </LabeledInput>
            <LabeledInput label={"Workload"} showRequiredIcon={!previousReview}>
              <RatingSelector
                selectedRating={workload}
                ratingType={RatingType.workload}
                onSelectedRatingChange={setWorkload}
              />
            </LabeledInput>
            <LabeledInput label={"Value"} showRequiredIcon={!previousReview}>
              <RatingSelector
                selectedRating={value}
                ratingType={RatingType.value}
                onSelectedRatingChange={setValue}
              />
            </LabeledInput>
            <LabeledInput label={"Comment"}>
              <Input
                placeholder={"Optional"}
                value={comment}
                onChangeText={setComment}
                multiline
                height={"130px"}
              />
            </LabeledInput>
            {previousReview && (
              <LeftAlignedButton
                title={"Delete"}
                showChevron={false}
                marginTop={"15px"}
                _text={colorModeResponsiveStyle((selector) => ({
                  color: selector({
                    light: theme.colors.red[600],
                    dark: theme.colors.red[500],
                  }),
                }))}
                onPress={() => {
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
