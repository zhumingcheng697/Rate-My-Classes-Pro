import React, { useEffect, useMemo, useState } from "react";
import { Switch as NativeSwitch, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Text, HStack, Switch, VStack, Box, theme } from "native-base";

import AlertPopup from "../../components/AlertPopup";
import AppIconSwitcher from "../../components/AppIconSwitcher";
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
import { validateSettings } from "../../libs/utils";

export default function SettingsScreen() {
  const {
    user,
    username,
    isAuthenticated,
    isSettingsSettled,
    updateUsername,
    db,
  } = useAuth();
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [canClear, setCanClear] = useState(false);
  const [previousUsername, setPreviousUsername] = useState(
    isAuthenticated ? username : ""
  );
  const [newUsername, setNewUsername] = useState(
    (isAuthenticated && username) || ""
  );
  const settings = useSelector((state) => state.settings);
  const showPreviousSemesters = settings.showPreviousSemesters;

  const semester = useMemo(
    () => new Semester(settings.selectedSemester),
    [settings.selectedSemester]
  );

  const semesterOptions = useMemo(
    () => Semester.getSemesterOptions(showPreviousSemesters).reverse(),
    [showPreviousSemesters]
  );

  const isCatalyst = useIsCatalyst();
  const canSelectAlternativeIcon = Platform.OS !== "web" && !isCatalyst;

  useEffect(() => {
    if (isAuthenticated && username) {
      setPreviousUsername(username);
      setNewUsername(username);
    }
  }, [user, isAuthenticated, username]);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <AlertPopup
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        header={"Unable to Update Settings"}
      />
      <VStack margin={"10px"} space={"8px"}>
        {isAuthenticated && (
          <LabeledInput label={"Username"} isDisabled={!isSettingsSettled}>
            <ClearableInput
              isDisabled={!isSettingsSettled}
              canClear={canClear && !!newUsername}
              placeholder={previousUsername ?? "Me"}
              value={isSettingsSettled ? newUsername : " "}
              onChangeText={setNewUsername}
              returnKeyType={"done"}
              onFocus={() => setCanClear(true)}
              onBlur={async () => {
                setCanClear(false);
                try {
                  if (newUsername) {
                    setPreviousUsername(newUsername);
                    if (newUsername !== username)
                      await updateUsername(newUsername);
                  } else if (!newUsername && previousUsername) {
                    setNewUsername(previousUsername);
                    if (previousUsername !== username)
                      await updateUsername(previousUsername);
                  }
                } catch (e) {
                  setShowAlert(true);
                  console.error(e);
                }
              }}
            />
          </LabeledInput>
        )}
        <LabeledInput label={"Semester"} isDisabled={!isSettingsSettled}>
          <SemesterSelector
            isDisabled={!isSettingsSettled}
            selectedSemester={isSettingsSettled ? semester : undefined}
            semesterOptions={semesterOptions}
            onSelectedSemesterChange={async (newSemester) => {
              const newSettings = {
                ...settings,
                selectedSemester: newSemester.toJSON(),
              };

              const oldSemester = semester;
              selectSemester(dispatch)(newSemester);

              if (isAuthenticated && db) {
                try {
                  await db.updateSettings(validateSettings(newSettings));
                } catch (e) {
                  selectSemester(dispatch)(oldSemester);
                  setShowAlert(true);
                  console.error(e);
                }
              }
            }}
          />
        </LabeledInput>
        {canSelectAlternativeIcon && (
          <LabeledInput label={"App Icon"}>
            <AppIconSwitcher />
          </LabeledInput>
        )}
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
