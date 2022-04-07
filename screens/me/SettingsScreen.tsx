import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Icon, Box, Text, HStack, Switch, VStack } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import Semester from "../../shared/semester";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { selectSemester, setShowPreviousSemesters } from "../../redux/actions";

type SemesterOptionRecord = Record<string, Semester>;

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { selectedSemester, showPreviousSemesters } = useSelector(
    (state) => state.settings
  );
  const semesterOptions = useMemo(() => {
    const record: SemesterOptionRecord = {};
    for (let semester of Semester.getSemesterOptions(
      showPreviousSemesters
    ).reverse()) {
      record[semester.toString()] = semester;
    }
    return record;
  }, [showPreviousSemesters]);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <VStack margin={"10px"} space={"20px"}>
        <Box>
          <Text variant={"label"}>Semester</Text>
          <Select
            selectedValue={selectedSemester.toString()}
            onValueChange={(semesterName) => {
              selectSemester(dispatch)(semesterOptions[semesterName]);
            }}
            _selectedItem={{
              endIcon: (
                <Icon
                  color={"nyu.default"}
                  as={<Ionicons name={"checkmark"} />}
                />
              ),
            }}
          >
            {Object.keys(semesterOptions).map((semesterName) => (
              <Select.Item
                key={semesterName}
                label={semesterName}
                value={semesterName}
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
          <Switch
            isChecked={showPreviousSemesters}
            onValueChange={setShowPreviousSemesters(dispatch)}
            onTrackColor={"nyu.default"}
          />
        </HStack>
      </VStack>
    </KeyboardAwareSafeAreaScrollView>
  );
}