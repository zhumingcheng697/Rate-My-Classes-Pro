import { Text, Button, Input, VStack, Box } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import PlainTextButton from "../../components/PlainTextButton";

type SignInScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "SignIn"
>;

export default function SignInScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        <VStack marginX={"10px"} space={"8px"}>
          <Box>
            <Text variant={"label"}>Email</Text>
            <Input
              autoCompleteType={"email"}
              autoCorrect={false}
              autoCapitalize={"none"}
              keyboardType={"email-address"}
            />
          </Box>
          <Box>
            <Text variant={"label"}>Password</Text>
            <Input variant={"password"} />
          </Box>
          <Button
            marginY={"15px"}
            onPress={() => {
              navigation.replace("Account");
            }}
          >
            <Text variant={"button"}>Sign In</Text>
          </Button>
          <Box>
            <Text textAlign={"center"}>Don’t have an account yet?</Text>
            <PlainTextButton
              title={"Sign Up"}
              onPress={() => {
                navigation.replace("SignUp");
              }}
            />
          </Box>
        </VStack>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
