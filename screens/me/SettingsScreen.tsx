import React, { useEffect, useMemo, useState } from "react";
import { Switch as NativeSwitch, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Text, HStack, Switch, VStack, Box, theme } from "native-base";

import LabeledInput from "../../components/LabeledInput";
import ClearableInput from "../../components/ClearableInput";
import { SemesterSelector } from "../../components/Selector";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { useIsCatalyst } from "../../libs/hooks";
import Semester from "../../libs/semester";
import { selectSemester, setShowPreviousSemesters } from "../../redux/actions";
import { useAuth } from "../../mongodb/auth";
import colors from "../../styling/colors";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";

export default function SettingsScreen() {
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

  useEffect(() => {
    if (auth.isAuthenticated && auth.username) {
      setPreviousUsername(auth.username);
      setNewUsername(auth.username);
    }
  }, [auth.user, auth.isAuthenticated, auth.username]);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <VStack margin={"10px"} space={"8px"}>
        {auth.isAuthenticated && (
          <LabeledInput label={"Username"}>
            <ClearableInput
              canClear={canClear && !!newUsername}
              placeholder={previousUsername ?? "Me"}
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
        {/* // TODO: uncomment after schedge is back */}
        {/* <HStack
          justifyContent={"space-between"}
          alignContent={"center"}
          alignItems={"center"}
          marginTop={"10px"}
        >
          <Text
            fontSize={"17px"}
            fontWeight={"semibold"}
            flexShrink={1}
            {...colorModeResponsiveStyle((selector) => ({
              color: selector(colors.nyu),
            }))}
          >
            Show Previous Semesters
          </Text>
          {Platform.OS === "macos" || useIsCatalyst() ? (
            <Box marginRight={"-35px"}>
              <NativeSwitch
                value={showPreviousSemesters}
                onValueChange={setShowPreviousSemesters(dispatch)}
              />
            </Box>
          ) : (
            <Switch
              isChecked={showPreviousSemesters}
              onValueChange={setShowPreviousSemesters(dispatch)}
            />
          )}
        </HStack>
        <Text
          lineHeight={"sm"}
          {...colorModeResponsiveStyle((selector) => ({
            color: selector({
              light: theme.colors.gray[500],
              dark: theme.colors.gray[400],
            }),
          }))}
        >
          {showPreviousSemesters
            ? "Future and current semesters as well as the previous 4 semesters are shown."
            : "Hide previous semesters for clarity. Only future and current semesters are shown."}
        </Text> */}
      </VStack>
    </KeyboardAwareSafeAreaScrollView>
  );
}
