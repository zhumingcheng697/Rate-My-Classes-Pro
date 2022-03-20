import { useState, useRef } from "react";
import { Text, VStack, AlertDialog, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import LeftAlignedButton from "../../components/LeftAlignedButton";

type MeAccountScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Account"
>;

export default function MeAccountScreen() {
  const navigation = useNavigation<MeAccountScreenNavigationProp>();
  const ref = useRef();
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <AlertDialog
        leastDestructiveRef={ref}
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
        }}
      >
        <AlertDialog.Content>
          <AlertDialog.Header>Sign Out</AlertDialog.Header>
          <AlertDialog.Body>
            You are about to sign out. After you signed out, you will have to
            sign in again with your email and password.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                _pressed={{ opacity: 0.5 }}
                _hover={{ opacity: 0.5 }}
                onPress={() => {
                  setShowAlert(false);
                }}
                ref={ref}
              >
                Cancel
              </Button>
              <Button
                background={"red.600"}
                onPress={() => {
                  setShowAlert(false);
                  navigation.replace("SignIn");
                }}
              >
                Sign Out
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <KeyboardAwareSafeAreaScrollView>
        <Text variant={"h1"}>McCoy Applseed</Text>
        <VStack margin={"10px"} space={"12px"}>
          <LeftAlignedButton
            title={"Starred"}
            onPress={() => {
              navigation.push("Starred");
            }}
          />
          <LeftAlignedButton
            title={"Reviewed"}
            onPress={() => {
              navigation.push("Reviewed");
            }}
          />
          <LeftAlignedButton
            title={"Settings"}
            onPress={() => {
              navigation.push("Settings");
            }}
          />
          <LeftAlignedButton
            title={"Sign Out"}
            _text={{ color: "red.600" }}
            showChevron={false}
            marginTop={"15px"}
            onPress={() => {
              setShowAlert(true);
            }}
          />
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
