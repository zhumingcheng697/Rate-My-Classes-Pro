import { Text, Button, Input, VStack, Box } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import SafeAreaScrollView from "../../containers/SafeAreaScrollView";

type MeSignInScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Me-SignIn"
>;

export default function MeSignInScreen() {
  const navigation = useNavigation<MeSignInScreenNavigationProp>();

  return (
    <SafeAreaScrollView>
      <VStack marginX={"10px"} space={"5px"}>
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
          marginY={"10px"}
          onPress={() => {
            navigation.replace("Me-Account");
          }}
        >
          Sign In
        </Button>
      </VStack>
      <Button
        variant={"link"}
        marginX={"10px"}
        onPress={() => {
          navigation.replace("Me-SignUp");
        }}
      >
        Don’t have an account yet? Sign Up.
      </Button>
    </SafeAreaScrollView>
  );
}
