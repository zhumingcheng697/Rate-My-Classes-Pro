import { Text, Button, Input, VStack, Box, Pressable } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import SafeAreaScrollView from "../../containers/SafeAreaScrollView";

type MeSignUpScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Me-SignUp"
>;

export default function MeSignUpScreen() {
  const navigation = useNavigation<MeSignUpScreenNavigationProp>();

  return (
    <SafeAreaScrollView>
      <VStack marginX={"10px"} space={"5px"}>
        <Box>
          <Text variant={"label"}>Username</Text>
          <Input autoCompleteType={"username"} />
        </Box>
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
        <Box>
          <Text variant={"label"}>Confirm Password</Text>
          <Input variant={"password"} />
        </Box>
        <Button
          marginY={"15px"}
          onPress={() => {
            navigation.replace("Me-Account");
          }}
        >
          Sign Up
        </Button>
        <Box>
          <Text textAlign={"center"}>Already have an account?</Text>
          <Pressable
            onPress={() => {
              navigation.replace("Me-SignIn");
            }}
          >
            {({ isPressed, isHovered }) => (
              <Text
                color={"nyu.default"}
                fontWeight={"medium"}
                textAlign={"center"}
                opacity={isPressed || isHovered ? 0.5 : 1}
              >
                Sign In
              </Text>
            )}
          </Pressable>
        </Box>
      </VStack>
    </SafeAreaScrollView>
  );
}
