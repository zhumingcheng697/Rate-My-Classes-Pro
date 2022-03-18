import { Text } from "native-base";
import { useRoute } from "@react-navigation/native";

import { type ClassInfo } from "../../shared/types";
import SafeAreaScrollView from "../../components/SafeAreaScrollView";

export default function ClassDetailScreen() {
  const route = useRoute();
  const classInfo = route.params as ClassInfo;

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>{"Mobile Application Development"}</Text>
      <Text variant={"h2"}>
        {"Tandon School of Engineering"} | {"Integrated Digital Media"}
      </Text>
      {!!classInfo.description && (
        <Text fontSize={"md"} margin={"10px"}>
          {classInfo.description}
        </Text>
      )}
    </SafeAreaScrollView>
  );
}
