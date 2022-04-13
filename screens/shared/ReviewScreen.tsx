import React, { useMemo } from "react";
import { Box, Input, Select, Text, VStack } from "native-base";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import LabeledInput from "../../components/LabeledInput";
import SemesterSelector from "../../components/SemesterSelector";
import Semester from "../../libs/semester";

export default function ReviewScreen() {
  const semesterOptions = useMemo(
    () => Semester.getSemesterOptions(true, false).reverse(),
    []
  );

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        <Text variant={"h1"}>{"Mobile App Development"}</Text>
        <Text variant={"h2"}>{"DM-UY 4193"}</Text>
        <VStack marginX={"10px"} marginY={"5px"} space={"8px"}>
          <LabeledInput label={"Enjoyment"} useBoldLabel showRequiredIcon>
            <Select />
          </LabeledInput>
          <LabeledInput label={"Difficulty"} useBoldLabel showRequiredIcon>
            <Select />
          </LabeledInput>
          <LabeledInput label={"Workload"} useBoldLabel showRequiredIcon>
            <Select />
          </LabeledInput>
          <LabeledInput label={"Value"} useBoldLabel showRequiredIcon>
            <Select />
          </LabeledInput>
          <LabeledInput label={"Semester"} useBoldLabel showRequiredIcon>
            <SemesterSelector
              semesterOptions={semesterOptions}
              onSelectedSemesterChange={() => {}}
            />
          </LabeledInput>
          <LabeledInput label={"Instructor"} useBoldLabel showRequiredIcon>
            <Input />
          </LabeledInput>
          <LabeledInput label={"Comment"} useBoldLabel>
            <Input placeholder={"Optional"} multiline height={"130px"} />
          </LabeledInput>
        </VStack>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
