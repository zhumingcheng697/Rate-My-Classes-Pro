import React, { useState, useRef } from "react";
import {
  Select,
  Icon,
  Box,
  Text,
  HStack,
  Switch,
  Spacer,
  VStack,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import Semester from "../../shared/semester";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";

export default function SettingsScreen() {
  const semesterOptions = useRef(Semester.getSemesterOptions().reverse());
  const [selectedIndex, setSelectedIndex] = useState(() =>
    semesterOptions.current.findIndex(
      (semester) =>
        semester.toString() === Semester.predictCurrentSemester().toString()
    )
  );

  return (
    <KeyboardAwareSafeAreaScrollView>
      <VStack margin={"10px"} space={"20px"}>
        <Box>
          <Text variant={"label"}>Semester</Text>
          <Select
            defaultValue={selectedIndex.toString()}
            selectedValue={selectedIndex.toString()}
            onValueChange={(value) => setSelectedIndex(parseInt(value))}
            _selectedItem={{
              endIcon: (
                <Icon
                  color={"nyu.default"}
                  as={<Ionicons name={"checkmark"} />}
                />
              ),
            }}
          >
            {semesterOptions.current.map((semester, index) => (
              <Select.Item
                key={index.toString()}
                label={semester.toString()}
                value={index.toString()}
              />
            ))}
          </Select>
        </Box>
        <HStack
          justifyContent={"space-between"}
          alignContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={"17px"}>Show Previous Semesters</Text>
          <Switch onTrackColor={"nyu.default"} />
        </HStack>
      </VStack>
    </KeyboardAwareSafeAreaScrollView>
  );
}
