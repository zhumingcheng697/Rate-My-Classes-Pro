import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Text, HStack, Switch, VStack } from "native-base";

import Semester from "../../libs/semester";
import LabeledInput from "../../components/LabeledInput";
import ClearableInput from "../../components/ClearableInput";
import SemesterSelector from "../../components/SemesterSelector";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { selectSemester, setShowPreviousSemesters } from "../../redux/actions";
import { useAuth } from "../../mongodb/auth";
import { useColorScheme } from "react-native";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const auth = useAuth();
  const dispatch = useDispatch();
  const [canClear, setCanClear] = useState(false);
  const [previousUsername, setPreviousUsername] = useState(
    auth.isAuthenticated ? auth.username : ""
  );
  const [newUsername, setNewUsername] = useState(
    (auth.isAuthenticated && auth.username) || ""
  );
  const settings = useSelector((state) => state.settings);
  const showPreviousSemesters = settings.showPreviousSemesters;

  const selectedSemester = useMemo(
    () => new Semester(settings.selectedSemester),
    [settings.selectedSemester]
  );

  const semesterOptions = useMemo(
    () => Semester.getSemesterOptions(showPreviousSemesters).reverse(),
    [showPreviousSemesters]
  );

  return (
    <KeyboardAwareSafeAreaScrollView>
      <VStack margin={"10px"} space={"8px"}>
        {auth.isAuthenticated && (
          <LabeledInput label={"Username"}>
            <ClearableInput
              canClear={canClear && !!newUsername}
              placeholder={previousUsername ?? "McCoy Appleseed"}
              value={newUsername}
              onChangeText={setNewUsername}
              returnKeyType={"done"}
              onFocus={() => {
                setCanClear(true);
              }}
              onEndEditing={() => {
                setCanClear(false);
                if (newUsername) {
                  setPreviousUsername(newUsername);
                  if (newUsername !== auth.username)
                    auth.updateUsername(newUsername);
                } else if (!newUsername && previousUsername) {
                  setNewUsername(previousUsername);
                  if (previousUsername !== auth.username)
                    auth.updateUsername(previousUsername);
                }
              }}
            />
          </LabeledInput>
        )}
        <LabeledInput label={"Semester"}>
          <SemesterSelector
            selectedSemester={selectedSemester}
            semesterOptions={semesterOptions}
            onSelectedSemesterChange={selectSemester(dispatch)}
          />
        </LabeledInput>
        <HStack
          justifyContent={"space-between"}
          alignContent={"center"}
          alignItems={"center"}
          marginY={"10px"}
        >
          <Text
            fontSize={"17px"}
            fontWeight={"semibold"}
            color={colorScheme === "dark" ? "nyu.dark" : "nyu.light"}
          >
            Show Previous Semesters
          </Text>
          <Switch
            isChecked={showPreviousSemesters}
            onValueChange={setShowPreviousSemesters(dispatch)}
            onTrackColor={colorScheme === "dark" ? "nyu.dark" : "nyu.light"}
          />
        </HStack>
      </VStack>
    </KeyboardAwareSafeAreaScrollView>
  );
}
