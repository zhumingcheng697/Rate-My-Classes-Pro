import { Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import NavigationButton from "../../components/NavigationButton";

type MeAccountScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Me-Account"
>;

export default function MeAccountScreen() {
  const navigation = useNavigation<MeAccountScreenNavigationProp>();

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Text variant={"h1"}>McCoy Applseed</Text>
      <NavigationButton
        title={"Starred"}
        margin={"10px"}
        onPress={() => {
          navigation.push("Me-Starred");
        }}
      />
      <NavigationButton
        title={"Reviewed"}
        margin={"10px"}
        onPress={() => {
          navigation.push("Me-Reviewed");
        }}
      />
      <NavigationButton
        title={"Sign Out"}
        _text={{ color: "red.600" }}
        margin={"10px"}
        onPress={() => {
          navigation.replace("Me-SignIn");
        }}
      />
    </KeyboardAwareSafeAreaScrollView>
  );
}
