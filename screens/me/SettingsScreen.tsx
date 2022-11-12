import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Switch as NativeSwitch, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  HStack,
  Switch,
  VStack,
  Box,
  theme,
  Button,
  type IButtonProps,
} from "native-base";
import { type NavigationProp, useNavigation } from "@react-navigation/native";

import AlertPopup from "../../components/AlertPopup";
import AppIconSwitcher from "../../components/AppIconSwitcher";
import ClearableInput from "../../components/ClearableInput";
import LabeledInput from "../../components/LabeledInput";
import { LeftAlignedButton } from "../../components/LinkCompatibleButton";
import { SemesterSelector } from "../../components/Selector";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { useIsCatalyst } from "../../libs/hooks";
import { type MeNavigationParamList } from "../../libs/types";
import { composeErrorMessage, validateSettings } from "../../libs/utils";
import { AppleOAuth, GoogleOAuth, OAuthSignInOptions } from "../../libs/oauth";
import Semester from "../../libs/semester";
import { selectSemester, setShowPreviousSemesters } from "../../redux/actions";
import { type AuthContext, useAuth } from "../../mongodb/auth";
import colors from "../../styling/colors";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";

type DeleteAccountButtonBaseProps = {
  auth: AuthContext;
  onSetup: () => void;
  callback: (success: boolean) => void;
  onError: (error: any) => void;
};

type DeleteAccountButtonProps = DeleteAccountButtonBaseProps &
  Omit<IButtonProps, keyof DeleteAccountButtonBaseProps | "onPress">;

function DeleteOAuthAccountButton({
  auth,
  onSetup,
  callback,
  onError,
  provider,
  ...rest
}: DeleteAccountButtonProps & { provider: "Apple" | "Google" }) {
  const useSignIn = useMemo(
    () => (provider === "Apple" ? AppleOAuth.useSignIn : GoogleOAuth.useSignIn),
    []
  );

  const signInOptions: OAuthSignInOptions = useMemo(
    () => ({
      callback: async (res) => {
        try {
          if (!res) {
            return callback(false);
          }

          // if (provider === "Apple") {
          //   await auth.deleteAppleAccount(res.authCode);
          // } else {
          //   await auth.deleteGoogleAccount(res.authCode);
          // }
          callback(true);
        } catch (error: any) {
          onError(error);
        }
      },
      onError,
      flow: "authCode",
    }),
    [auth, callback, onError]
  );

  const deleteAccount = useSignIn(signInOptions);

  return (
    <Button
      {...rest}
      onPress={async () => {
        onSetup();
        deleteAccount();
      }}
    >
      Delete
    </Button>
  );
}

function DeleteAppleAccountButton(props: DeleteAccountButtonProps) {
  return <DeleteOAuthAccountButton {...props} provider={"Apple"} />;
}

function DeleteGoogleAccountButton(props: DeleteAccountButtonProps) {
  return <DeleteOAuthAccountButton {...props} provider={"Google"} />;
}

function DeleteEmailPasswordAccountButton({
  auth,
  onSetup,
  callback,
  onError,
  ...rest
}: DeleteAccountButtonProps) {
  return (
    <Button
      {...rest}
      onPress={async () => {
        try {
          onSetup();
          // await auth.deleteEmailPasswordAccount();
          callback(true);
        } catch (error: any) {
          onError(error);
        }
      }}
    >
      Delete
    </Button>
  );
}

type DeleteAccountButtonSelectorBaseProps = {
  auth: AuthContext;
  navigation: NavigationProp<MeNavigationParamList, "Settings">;
  setIsDeletingAccount: (isDeletingAlert: boolean) => void;
  setDeleteAccountError: (error: any) => void;
  setShowDeleteAccountAlert: (showAlert: boolean) => void;
  setShowDeleteAccountError: (showAlert: boolean) => void;
};

type DeleteAccountButtonSelectorProps = DeleteAccountButtonSelectorBaseProps &
  Omit<IButtonProps, keyof DeleteAccountButtonSelectorBaseProps | "onPress">;

function DeleteAccountButton({
  auth,
  navigation,
  setIsDeletingAccount,
  setDeleteAccountError,
  setShowDeleteAccountAlert,
  setShowDeleteAccountError,
  ...rest
}: DeleteAccountButtonSelectorProps) {
  const provider = auth.user?.providerType;
  const onSetup = useCallback(() => {
    setIsDeletingAccount(true);
    setShowDeleteAccountAlert(false);
  }, []);
  const onSuccess = useCallback((success) => {
    setDeleteAccountError(null);
    setShowDeleteAccountError(false);
    setIsDeletingAccount(false);
    if (success) navigation.goBack();
  }, []);
  const onError = useCallback((error: any) => {
    console.error(error);
    setDeleteAccountError(error);
    setShowDeleteAccountError(true);
    setIsDeletingAccount(false);
  }, []);
  const props = useMemo(
    () => ({ auth, onSetup, onSuccess, onError, ...rest }),
    [auth, onSetup, onSuccess, onError, rest]
  );

  if (provider === "custom-token")
    return (
      <DeleteAppleAccountButton
        auth={auth}
        onSetup={onSetup}
        callback={onSuccess}
        onError={onError}
        {...rest}
      />
    );
  else if (provider === "oauth2-google")
    return (
      <DeleteGoogleAccountButton
        auth={auth}
        onSetup={onSetup}
        callback={onSuccess}
        onError={onError}
        {...rest}
      />
    );
  else
    return (
      <DeleteEmailPasswordAccountButton
        auth={auth}
        onSetup={onSetup}
        callback={onSuccess}
        onError={onError}
        {...rest}
      />
    );
}

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
  const navigation =
    useNavigation<NavigationProp<MeNavigationParamList, "Settings">>();
  const dispatch = useDispatch();
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
        body={`You are about to permanently delete your account. This action is irreversible!${
          auth.user?.providerType === "custom-token" ||
          auth.user?.providerType === "oauth2-google"
            ? " Your account will be deleted immediately after you reauthenticate."
            : ""
        }`}
        footerPrimaryButton={
          <DeleteAccountButton
            auth={auth}
            navigation={navigation}
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
            title={"Delete Account"}
            showChevron={false}
            marginTop={"15px"}
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
