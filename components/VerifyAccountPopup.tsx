import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button, Input, Text, theme, VStack } from "native-base";
import { Keyboard } from "react-native";

import { composeErrorMessage } from "../libs/utils";
import { useAuth } from "../mongodb/auth";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";
import AlertPopup from "./AlertPopup";
import LabeledInput from "./LabeledInput";

enum VerifyAccountState {
  askingForEmail,
  sendingCode,
  failedToSendCode,
  codeSent,
  verifyingCode,
  failedToVerifyCode,
}

export type VerifyAccountAlertProps = {
  isVerifying: boolean;
  setIsVerifying: Dispatch<SetStateAction<boolean>>;
};

export default function VerifyAccountAlert({
  isVerifying,
  setIsVerifying,
}: VerifyAccountAlertProps) {
  const [verifyAccountState, setVerifyAccountState] = useState(
    VerifyAccountState.codeSent
  );
  const [codeSendError, setCodeSendError] = useState<any>(null);
  const [codeVerifyError, setCodeVerifyError] = useState<any>(null);
  const [nyuEmail, setNyuEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const { isVerified, sendConfirmationCode, verifyConfirmationCode } =
    useAuth();

  useEffect(() => {
    if (isVerifying) {
      setVerifyAccountState(VerifyAccountState.codeSent);
      setCodeSendError(null);
      setCodeVerifyError(null);
      setNyuEmail("");
      setVerificationCode("");
    }
  }, [isVerifying]);

  return (
    <>
      <AlertPopup
        isOpen={isVerifying && isVerified}
        onClose={() => setIsVerifying(false)}
        header={"Account Verified"}
        body={
          "Thank you for verifying your account. You can start reviewing classes now!"
        }
      />
      <AlertPopup
        isOpen={
          isVerifying &&
          !isVerified &&
          (verifyAccountState === VerifyAccountState.askingForEmail ||
            verifyAccountState === VerifyAccountState.sendingCode)
        }
        onClose={() => setIsVerifying(false)}
        header={"Verify Account"}
        body={
          <VStack space={"8px"}>
            <Text
              {...colorModeResponsiveStyle((selector) => ({
                color: selector({
                  light: theme.colors.gray[500],
                  dark: theme.colors.gray[300],
                }),
              }))}
            >
              To ensure the authenticity of the reviews, reviewers need to
              verify their account with an NYU email address. This email will
              only be used once to receive a confirmation code and will never be
              recorded.
            </Text>
            <LabeledInput label={"NYU Email"}>
              <Input
                isDisabled={
                  verifyAccountState === VerifyAccountState.sendingCode
                }
                placeholder={"@nyu.edu"}
                value={nyuEmail}
                onChangeText={setNyuEmail}
                autoCorrect={false}
                autoCapitalize={"none"}
                keyboardType={"email-address"}
                textContentType={"emailAddress"}
              />
            </LabeledInput>
          </VStack>
        }
        footerPrimaryButton={(isLandscape: boolean) => (
          <Button
            isDisabled={
              !/^(?:[^\s.][^\s]*[^\s.]|[^\s.]+)+@nyu\.edu$/i.test(nyuEmail) ||
              verifyAccountState === VerifyAccountState.sendingCode
            }
            onPress={async () => {
              setVerifyAccountState(VerifyAccountState.sendingCode);
              Keyboard.dismiss();
              try {
                await sendConfirmationCode(nyuEmail);
                setCodeSendError(null);
                setVerifyAccountState(VerifyAccountState.codeSent);
              } catch (e) {
                setCodeSendError(e);
                setVerifyAccountState(VerifyAccountState.failedToSendCode);
              }
            }}
            borderRadius={isLandscape ? "8px" : undefined}
            pt={isLandscape ? "5px" : undefined}
            pb={isLandscape ? "5px" : undefined}
          >
            Send Code
          </Button>
        )}
      />
      <AlertPopup
        isOpen={
          isVerifying &&
          !isVerified &&
          verifyAccountState === VerifyAccountState.failedToSendCode
        }
        onClose={() => setIsVerifying(false)}
        header={"Unable to Send Confirmation Code"}
        body={composeErrorMessage(codeSendError)}
      />
      <AlertPopup
        isOpen={
          isVerifying &&
          !isVerified &&
          (verifyAccountState === VerifyAccountState.codeSent ||
            verifyAccountState === VerifyAccountState.verifyingCode)
        }
        onClose={() => setIsVerifying(false)}
        header={"Confirmation Code Sent"}
        body={
          <VStack space={"8px"}>
            <Text
              {...colorModeResponsiveStyle((selector) => ({
                color: selector({
                  light: theme.colors.gray[500],
                  dark: theme.colors.gray[300],
                }),
              }))}
            >
              Please check the NYU email you provided and type in the
              confirmation code you received.
            </Text>
            <LabeledInput label={"Confirmation Code"}>
              <Input
                isDisabled={verifyAccountState !== VerifyAccountState.codeSent}
                value={verificationCode}
                onChangeText={(text) => {
                  setVerificationCode(text.toLowerCase());
                }}
                autoCorrect={false}
                autoCapitalize={"none"}
                keyboardType={"ascii-capable"}
                textContentType={"oneTimeCode"}
              />
            </LabeledInput>
          </VStack>
        }
        footerPrimaryButton={(isLandscape: boolean) => (
          <Button
            isDisabled={!verificationCode}
            onPress={async () => {
              setVerifyAccountState(VerifyAccountState.verifyingCode);
              Keyboard.dismiss();
              try {
                await verifyConfirmationCode(verificationCode);
                setCodeVerifyError(null);
              } catch (e) {
                setCodeVerifyError(e);
                setVerifyAccountState(VerifyAccountState.failedToVerifyCode);
              }
            }}
            borderRadius={isLandscape ? "8px" : undefined}
            pt={isLandscape ? "5px" : undefined}
            pb={isLandscape ? "5px" : undefined}
          >
            Verify
          </Button>
        )}
      />
      <AlertPopup
        isOpen={
          isVerifying &&
          !isVerified &&
          verifyAccountState === VerifyAccountState.failedToVerifyCode
        }
        onClose={() => setIsVerifying(false)}
        header={"Unable to Verify Confirmation Code"}
        body={composeErrorMessage(codeVerifyError)}
      />
    </>
  );
}
