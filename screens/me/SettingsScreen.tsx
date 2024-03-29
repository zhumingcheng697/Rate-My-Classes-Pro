import React, { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { VStack } from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import AlertPopup from "../../components/AlertPopup";
import AppIconSwitcher from "../../components/AppIconSwitcher";
import ClearableInput from "../../components/ClearableInput";
import { DeleteAccountButton } from "../../components/DeleteAccountButton";
import LabeledInput from "../../components/LabeledInput";
import { LeftAlignedButton } from "../../components/LinkCompatibleButton";
import { SemesterSelector } from "../../components/Selector";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { useHandoff, useIsCatalyst, useIsCurrentRoute } from "../../libs/hooks";
import { composeErrorMessage, Route, validateSettings } from "../../libs/utils";
import Semester from "../../libs/semester";
import Action from "../../redux/actions";
import { useAuth } from "../../mongodb/auth";

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
  const route = useRoute();
  const isCurrentRoute = useIsCurrentRoute(route.key);
  const dispatch = useDispatch();
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [showSettingsAlert, setShowSettingsAlert] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteAccountAlert, setShowDeleteAccountAlert] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<any>(null);
  const [showDeleteAccountError, setShowDeleteAccountError] = useState(false);
  const [canClear, setCanClear] = useState(false);
  const [deleteReviews, setDeleteReviews] = useState(false);
  const [previousUsername, setPreviousUsername] = useState(
    isAuthenticated ? username : ""
  );
  const [newUsername, setNewUsername] = useState(
    (isAuthenticated && username) || ""
  );
  const settings = useSelector((state) => state.settings);
  const signInProvider = user?.providerType;

  const semester = useMemo(
    () => new Semester(settings.selectedSemester),
    [settings.selectedSemester.semesterCode, settings.selectedSemester.year]
  );

  const semesterOptions = useMemo(
    () => Semester.getSemesterOptions().reverse(),
    []
  );

  const isCatalyst = useIsCatalyst();
  const isFocused = useIsFocused();
  const canSelectAlternativeIcon = Platform.OS !== "web" && !isCatalyst;

  useHandoff({
    isFocused,
    route: Route("MeTab", "Settings"),
    title: "Update Settings",
  });

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
    if (
      accountDeleted &&
      !isDeletingAccount &&
      !isAuthenticated &&
      isCurrentRoute
    ) {
      navigation.goBack();
    }
  }, [
    navigation,
    accountDeleted,
    isDeletingAccount,
    isAuthenticated,
    isCurrentRoute,
  ]);

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
        header={
          deleteReviews
            ? "Delete Account and All Reviews"
            : "Delete Account Only"
        }
        body={`You are about to permanently delete your account${
          deleteReviews
            ? " and all your reviews. All your data will be erased."
            : ". Your reviews will remain available anonymously."
        } This action is not reversible!${
          signInProvider === "custom-token" ||
          signInProvider === "oauth2-google"
            ? ` Your account${
                deleteReviews ? " and all your reviews " : " "
              }will be deleted immediately after you reauthenticate with ${
                signInProvider === "custom-token" ? "Apple" : "Google"
              }.`
            : ""
        }`}
        footerPrimaryButton={(isCompact) => (
          <DeleteAccountButton
            auth={auth}
            variant={"dangerous"}
            borderRadius={isCompact ? 8 : undefined}
            py={isCompact ? "5px" : "8px"}
            deleteReviews={deleteReviews}
            setAccountDeleted={setAccountDeleted}
            setIsDeletingAccount={setIsDeletingAccount}
            setDeleteAccountError={setDeleteAccountError}
            setShowDeleteAccountAlert={setShowDeleteAccountAlert}
            setShowDeleteAccountError={setShowDeleteAccountError}
          />
        )}
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

              const oldSemester = semester.toJSON();
              Action.loadSettings(dispatch)(newSettings);

              if (isAuthenticated && db) {
                try {
                  await db.updateSettings(validateSettings(newSettings));
                } catch (e) {
                  Action.selectSemester(dispatch)(oldSemester);
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
          <VStack space={"12px"} marginTop={"20px"}>
            <LeftAlignedButton
              title={
                isDeletingAccount && !deleteReviews
                  ? "Deleting Account…"
                  : "Delete Account Only"
              }
              showChevron={false}
              isDisabled={isDeletingAccount}
              _text={{ variant: "dangerousSubtleButton" }}
              onPress={() => {
                setDeleteReviews(false);
                setShowDeleteAccountAlert(true);
              }}
            />
            <LeftAlignedButton
              title={
                isDeletingAccount && deleteReviews
                  ? "Deleting Account and Reviews…"
                  : "Delete Account and All Reviews"
              }
              showChevron={false}
              isDisabled={isDeletingAccount}
              _text={{ variant: "dangerousSubtleButton" }}
              onPress={() => {
                setDeleteReviews(true);
                setShowDeleteAccountAlert(true);
              }}
            />
          </VStack>
        )}
      </VStack>
    </KeyboardAwareSafeAreaScrollView>
  );
}
