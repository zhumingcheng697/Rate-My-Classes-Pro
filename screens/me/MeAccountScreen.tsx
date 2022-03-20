import { Text, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";

type MeAccountScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Me-Account"
>;

export default function MeAccountScreen() {
  const navigation = useNavigation<MeAccountScreenNavigationProp>();

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Text variant={"h1"}>McCoy Applseed</Text>
      <Button
        variant={"subtle"}
        margin={"10px"}
        onPress={() => {
          navigation.push("Me-Starred");
        }}
      >
        <Text variant={"subtleButton"}>Starred</Text>
      </Button>
      <Button
        variant={"subtle"}
        margin={"10px"}
        onPress={() => {
          navigation.push("Me-Reviewed");
        }}
      >
        <Text variant={"subtleButton"}>Reviewed</Text>
      </Button>
      <Button
        variant={"subtle"}
        margin={"10px"}
        onPress={() => {
          navigation.replace("Me-SignIn");
        }}
      >
        <Text color={"red.600"} variant={"button"}>
          Sign Out
        </Text>
      </Button>
    </KeyboardAwareSafeAreaScrollView>
  );
}
