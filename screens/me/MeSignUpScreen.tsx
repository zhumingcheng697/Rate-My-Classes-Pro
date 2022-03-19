import { Text, Button, Input, VStack, Box } from "native-base";
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
          marginY={"10px"}
          onPress={() => {
            navigation.replace("Me-Account");
          }}
        >
          Sign Up
        </Button>
      </VStack>
      <Button
        variant={"link"}
        marginX={"10px"}
        onPress={() => {
          navigation.replace("Me-SignIn");
        }}
      >
        Already have an account? Sign In.
      </Button>
    </SafeAreaScrollView>
  );
}
