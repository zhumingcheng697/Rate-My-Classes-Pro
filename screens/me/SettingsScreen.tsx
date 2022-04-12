import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text, HStack, Switch, VStack } from "native-base";

import Semester from "../../libs/semester";
import ClearableInput from "../../components/ClearableInput";
import SemesterSelector from "../../components/SemesterSelector";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { selectSemester, setShowPreviousSemesters } from "../../redux/actions";
import { useAuth } from "../../mongodb/auth";

export default function SettingsScreen() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [canClear, setCanClear] = useState(false);
  const [previousUsername, setPreviousUsername] = useState(auth.username);
  const [newUsername, setNewUsername] = useState(auth.username ?? "");
  const { selectedSemester, showPreviousSemesters } = useSelector(
    (state) => state.settings
  );
  const semesterOptions = useMemo(
    () => Semester.getSemesterOptions(showPreviousSemesters).reverse(),
    [showPreviousSemesters]
  );

  return (
    <KeyboardAwareSafeAreaScrollView>
      <VStack margin={"10px"} space={"8px"}>
        {auth.isAuthenticated && (
          <Box>
            <Text variant={"label"} fontWeight={"semibold"} color={"nyu"}>
              Username
            </Text>
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
          </Box>
        )}
        <Box>
          <Text variant={"label"} fontWeight={"semibold"} color={"nyu"}>
            Semester
          </Text>
          <SemesterSelector
            selectedSemester={selectedSemester}
            semesterOptions={semesterOptions}
            onSelectedSemesterChange={selectSemester(dispatch)}
          />
        </Box>
        <HStack
          justifyContent={"space-between"}
          alignContent={"center"}
          alignItems={"center"}
          marginY={"10px"}
        >
          <Text fontSize={"17px"} fontWeight={"semibold"} color={"nyu"}>
            Show Previous Semesters
          </Text>
          <Switch
            isChecked={showPreviousSemesters}
            onValueChange={setShowPreviousSemesters(dispatch)}
            onTrackColor={"nyu"}
          />
        </HStack>
      </VStack>
    </KeyboardAwareSafeAreaScrollView>
  );
}
