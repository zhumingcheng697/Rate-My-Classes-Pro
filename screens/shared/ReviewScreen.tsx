import React, { useMemo } from "react";
import { Box, Input, Text, VStack } from "native-base";
import { useRoute, type RouteProp } from "@react-navigation/native";

import { type SharedNavigationParamList } from "../../libs/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import LabeledInput from "../../components/LabeledInput";
import RatingSelector, { RatingType } from "../../components/RatingSelector";
import SemesterSelector from "../../components/SemesterSelector";
import Semester from "../../libs/semester";
import { getFullClassCode } from "../../libs/utils";

type ReviewScreenRouteProp = RouteProp<SharedNavigationParamList, "Review">;

export default function ReviewScreen() {
  const route = useRoute<ReviewScreenRouteProp>();
  const { classInfo } = route.params;
  const semesterOptions = useMemo(
    () => Semester.getSemesterOptions(true, false).reverse(),
    []
  );

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        <Text variant={"h1"}>{classInfo.name}</Text>
        <Text variant={"h2"}>{getFullClassCode(classInfo)}</Text>
        <VStack marginX={"10px"} marginY={"5px"} space={"8px"}>
          <LabeledInput label={"Enjoyment"} showRequiredIcon>
            <RatingSelector
              ratingType={RatingType.enjoyment}
              onSelectedRatingChange={() => {}}
            />
          </LabeledInput>
          <LabeledInput label={"Difficulty"} showRequiredIcon>
            <RatingSelector
              ratingType={RatingType.difficulty}
              onSelectedRatingChange={() => {}}
            />
          </LabeledInput>
          <LabeledInput label={"Workload"} showRequiredIcon>
            <RatingSelector
              ratingType={RatingType.workload}
              onSelectedRatingChange={() => {}}
            />
          </LabeledInput>
          <LabeledInput label={"Value"} showRequiredIcon>
            <RatingSelector
              ratingType={RatingType.value}
              onSelectedRatingChange={() => {}}
            />
          </LabeledInput>
          <LabeledInput label={"Semester"} showRequiredIcon>
            <SemesterSelector
              semesterOptions={semesterOptions}
              onSelectedSemesterChange={() => {}}
            />
          </LabeledInput>
          <LabeledInput label={"Instructor"} showRequiredIcon>
            <Input />
          </LabeledInput>
          <LabeledInput label={"Comment"}>
            <Input placeholder={"Optional"} multiline height={"130px"} />
          </LabeledInput>
        </VStack>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
