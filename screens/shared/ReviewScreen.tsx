import React, { useMemo } from "react";
import { Box, HStack, Input, Select, Text, VStack } from "native-base";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
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
          <Box>
            <Text variant={"label"} fontWeight={"semibold"} color={"nyu"}>
              Enjoyment
            </Text>
            <Select />
          </Box>
          <Box>
            <Text variant={"label"} fontWeight={"semibold"} color={"nyu"}>
              Difficulty
            </Text>
            <Select />
          </Box>
          <Box>
            <Text variant={"label"} fontWeight={"semibold"} color={"nyu"}>
              Workload
            </Text>
            <Select />
          </Box>
          <Box>
            <Text variant={"label"} fontWeight={"semibold"} color={"nyu"}>
              Value
            </Text>
            <Select />
          </Box>
          <Box>
            <Text variant={"label"} fontWeight={"semibold"} color={"nyu"}>
              Semester
            </Text>
            <SemesterSelector
              semesterOptions={semesterOptions}
              onSelectedSemesterChange={() => {}}
            />
          </Box>
          <Box>
            <Text variant={"label"} fontWeight={"semibold"} color={"nyu"}>
              Instructor
            </Text>
            <Input />
          </Box>
          <Box>
            <HStack>
              <Text variant={"label"} fontWeight={"semibold"} color={"nyu"}>
                Comment
              </Text>
              <Text
                variant={"label"}
                marginLeft={"1px"}
                fontWeight={"bold"}
                color={"red.500"}
              >
                *
              </Text>
            </HStack>
            <Input placeholder={"Optional"} multiline={true} height={"130px"} />
          </Box>
        </VStack>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
