import { Text } from "native-base";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { type ClassInfo } from "../../shared/types";
import SafeAreaScrollView from "../../containers/SafeAreaScrollView";
import {
  getDepartmentNameByInfo,
  getSchoolNameByInfo,
} from "../../shared/utils";

export default function ClassDetailScreen() {
  const route = useRoute();
  const classInfo = route.params as ClassInfo;
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>{"Mobile Application Development"}</Text>
      <Text variant={"h2"}>
        {getSchoolNameByInfo(classInfo, schoolNames)}
        {" | "}
        {getDepartmentNameByInfo(classInfo, departmentNames)}
      </Text>
      {!!classInfo.description && (
        <Text fontSize={"md"} margin={"10px"}>
          {classInfo.description}
        </Text>
      )}
    </SafeAreaScrollView>
  );
}
