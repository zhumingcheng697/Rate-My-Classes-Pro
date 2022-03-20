import { Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import LeftAlignedButton from "../../components/LeftAlignedButton";

type MeAccountScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Me-Account"
>;

export default function MeAccountScreen() {
  const navigation = useNavigation<MeAccountScreenNavigationProp>();

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Text variant={"h1"}>McCoy Applseed</Text>
      <LeftAlignedButton
        title={"Starred"}
        margin={"10px"}
        onPress={() => {
          navigation.push("Me-Starred");
        }}
      />
      <LeftAlignedButton
        title={"Reviewed"}
        margin={"10px"}
        onPress={() => {
          navigation.push("Me-Reviewed");
        }}
      />
      <LeftAlignedButton
        title={"Settings"}
        margin={"10px"}
        onPress={() => {
          navigation.push("Me-Settings");
        }}
      />
      <LeftAlignedButton
        title={"Sign Out"}
        _text={{ color: "red.600" }}
        showChevron={false}
        margin={"10px"}
        onPress={() => {
          navigation.replace("Me-SignIn");
        }}
      />
    </KeyboardAwareSafeAreaScrollView>
  );
}
