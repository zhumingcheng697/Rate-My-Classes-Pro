import React, { useState, useMemo, useEffect } from "react";
import { Box, Input, Text, VStack } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type SharedNavigationParamList } from "../../libs/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import LabeledInput from "../../components/LabeledInput";
import RatingSelector, { RatingType } from "../../components/RatingSelector";
import SemesterSelector from "../../components/SemesterSelector";
import Semester from "../../libs/semester";
import { getFullClassCode } from "../../libs/utils";
import { Rating } from "../../libs/rating";
import { useAuth } from "../../mongodb/auth";

type ReviewScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Review"
>;

type ReviewScreenRouteProp = RouteProp<SharedNavigationParamList, "Review">;

export default function ReviewScreen() {
  const auth = useAuth();
  const navigation = useNavigation<ReviewScreenNavigationProp>();
  const route = useRoute<ReviewScreenRouteProp>();
  const { classInfo, previousReview } = route.params;

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

  const semesterOptions = useMemo(
    () =>
      previousReview
        ? [new Semester(previousReview.semester)]
        : Semester.getSemesterOptions(true, false).reverse(),
    []
  );

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
      navigation.setParams({
        newReview: {
          userId: auth.user.id,
          enjoyment,
          difficulty,
          workload,
          value,
          upvotes: {}, // `upsertReview` takes care of it with $set vs $setOnInsert
          downvotes: {}, // `upsertReview` takes care of it with $set vs $setOnInsert
          reviewedDate: Date.now(), // `upsertReview` takes care of it with $set vs $setOnInsert
          semester: semester.toJSON(),
          instructor,
          comment,
        },
      });
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
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        <Text variant={"h1"}>{classInfo.name}</Text>
        <Text variant={"h2"}>{getFullClassCode(classInfo)}</Text>
        <VStack marginX={"10px"} marginY={"5px"} space={"8px"}>
          <LabeledInput label={"Enjoyment"} showRequiredIcon>
            <RatingSelector
              selectedRating={enjoyment}
              ratingType={RatingType.enjoyment}
              onSelectedRatingChange={setEnjoyment}
            />
          </LabeledInput>
          <LabeledInput label={"Difficulty"} showRequiredIcon>
            <RatingSelector
              selectedRating={difficulty}
              ratingType={RatingType.difficulty}
              onSelectedRatingChange={setDifficulty}
            />
          </LabeledInput>
          <LabeledInput label={"Workload"} showRequiredIcon>
            <RatingSelector
              selectedRating={workload}
              ratingType={RatingType.workload}
              onSelectedRatingChange={setWorkload}
            />
          </LabeledInput>
          <LabeledInput label={"Value"} showRequiredIcon>
            <RatingSelector
              selectedRating={value}
              ratingType={RatingType.value}
              onSelectedRatingChange={setValue}
            />
          </LabeledInput>
          <LabeledInput label={"Semester"} showRequiredIcon>
            <SemesterSelector
              selectedSemester={semester}
              semesterOptions={semesterOptions}
              onSelectedSemesterChange={setSemester}
            />
          </LabeledInput>
          <LabeledInput label={"Instructor"} showRequiredIcon>
            <Input
              value={instructor}
              onChangeText={setInstructor}
              autoCapitalize={"words"}
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
        </VStack>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
