import { Text, Button, Input, VStack, Box, Pressable } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";

type MeSignInScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Me-SignIn"
>;

export default function MeSignInScreen() {
  const navigation = useNavigation<MeSignInScreenNavigationProp>();

  return (
    <KeyboardAwareSafeAreaScrollView>
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
            navigation.replace("Me-Account");
          }}
        >
          <Text variant={"button"}>Sign In</Text>
        </Button>
        <Box>
          <Text textAlign={"center"}>Don’t have an account yet?</Text>
          <Pressable
            onPress={() => {
              navigation.replace("Me-SignUp");
            }}
          >
            {({ isPressed, isHovered }) => (
              <Text
                variant={"textButton"}
                opacity={isPressed || isHovered ? 0.5 : 1}
              >
                Sign Up
              </Text>
            )}
          </Pressable>
        </Box>
      </VStack>
    </KeyboardAwareSafeAreaScrollView>
  );
}
