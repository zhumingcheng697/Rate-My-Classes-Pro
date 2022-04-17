import React from "react";
import { Text, VStack } from "native-base";

import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";

export default function ScheduleScreen() {
  return (
    <>
      <KeyboardAwareSafeAreaScrollView>
        <VStack margin={"10px"} space={"10px"}>
          <Text>Hello World</Text>
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
