import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Switch as NativeSwitch, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Text, HStack, Switch, VStack, Box, theme } from "native-base";
import { useNavigation } from "@react-navigation/native";

import AlertPopup from "../../components/AlertPopup";
import AppIconSwitcher from "../../components/AppIconSwitcher";
import ClearableInput from "../../components/ClearableInput";
import { DeleteAccountButton } from "../../components/DeleteAccountButton";
import LabeledInput from "../../components/LabeledInput";
import { LeftAlignedButton } from "../../components/LinkCompatibleButton";
import { SemesterSelector } from "../../components/Selector";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { useIsCatalyst } from "../../libs/hooks";
import { composeErrorMessage, validateSettings } from "../../libs/utils";
import Semester from "../../libs/semester";
import { selectSemester, setShowPreviousSemesters } from "../../redux/actions";
import { useAuth } from "../../mongodb/auth";
import colors from "../../styling/colors";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";

export default function SettingsScreen() {
  const auth = useAuth();
  const {
    user,
    username,
    isAuthenticated,
    isSettingsSettled,
    updateUsername,
    db,
  } = auth;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [showSettingsAlert, setShowSettingsAlert] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteAccountAlert, setShowDeleteAccountAlert] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<any>(null);
  const [showDeleteAccountError, setShowDeleteAccountError] = useState(false);
  const [canClear, setCanClear] = useState(false);
  const [previousUsername, setPreviousUsername] = useState(
    isAuthenticated ? username : ""
  );
  const [newUsername, setNewUsername] = useState(
    (isAuthenticated && username) || ""
  );
  const settings = useSelector((state) => state.settings);
  const showPreviousSemesters = settings.showPreviousSemesters;
  const signInProvider = user?.providerType;

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

  useEffect(() => {
    return navigation.addListener("beforeRemove", (e) => {
      if (isDeletingAccount) e.preventDefault();
    });
  }, [navigation, isDeletingAccount]);

  useEffect(() => {
    if (accountDeleted && !isDeletingAccount && !isAuthenticated) {
      navigation.goBack();
    }
  }, [navigation, accountDeleted, isDeletingAccount, isAuthenticated]);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <AlertPopup
        isOpen={showSettingsAlert}
        onClose={() => setShowSettingsAlert(false)}
        header={"Unable to Update Settings"}
      />
      <AlertPopup
        isOpen={!showSettingsAlert && showDeleteAccountError}
        onClose={() => setShowDeleteAccountError(false)}
        header={"Unable to Delete Account"}
        body={composeErrorMessage(deleteAccountError)}
      />
      <AlertPopup
        isOpen={
          isAuthenticated &&
          !showSettingsAlert &&
          !showDeleteAccountError &&
          showDeleteAccountAlert
        }
        onClose={() => setShowDeleteAccountAlert(false)}
        header={"Delete Account"}
        body={`You are about to permanently delete your account and lose all your stars and reviews. This action is not reversible!${
          signInProvider === "custom-token" ||
          signInProvider === "oauth2-google"
            ? ` Your account will be deleted immediately after you reauthenticate with ${
                signInProvider === "custom-token" ? "Apple" : "Google"
              }.`
            : ""
        }`}
        footerPrimaryButton={
          <DeleteAccountButton
            auth={auth}
            setAccountDeleted={setAccountDeleted}
            setIsDeletingAccount={setIsDeletingAccount}
            setDeleteAccountError={setDeleteAccountError}
            setShowDeleteAccountAlert={setShowDeleteAccountAlert}
            setShowDeleteAccountError={setShowDeleteAccountError}
            {...colorModeResponsiveStyle((selector) => ({
              background: selector({
                light: theme.colors.red[600],
                dark: theme.colors.red[500],
              }),
            }))}
          />
        }
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
                  setShowSettingsAlert(true);
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
                  setShowSettingsAlert(true);
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
        {isAuthenticated && (
          <LeftAlignedButton
            title={isDeletingAccount ? "Deleting Account…" : "Delete Account"}
            showChevron={false}
            marginTop={"20px"}
            isDisabled={isDeletingAccount}
            _text={colorModeResponsiveStyle((selector) => ({
              color: selector({
                light: theme.colors.red[600],
                dark: theme.colors.red[500],
              }),
            }))}
            onPress={() => setShowDeleteAccountAlert(true)}
          />
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
