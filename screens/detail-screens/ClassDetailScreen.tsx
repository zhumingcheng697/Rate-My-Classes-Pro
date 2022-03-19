import { Text } from "native-base";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { type ClassInfo } from "../../shared/types";
import SafeAreaScrollView from "../../containers/SafeAreaScrollView";
import { getDepartmentName, getSchoolName } from "../../shared/utils";

export default function ClassDetailScreen() {
  const route = useRoute();
  const classInfo = route.params as ClassInfo;
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>Lorem ipsum dolor sit amet</Text>
      <Text variant={"h2"}>
        {getSchoolName(classInfo, schoolNames)}
        {": "}
        {getDepartmentName(classInfo, departmentNames)}
      </Text>
      {!!classInfo.description && (
        <Text fontSize={"md"} margin={"10px"}>
          {classInfo.description}
        </Text>
      )}
    </SafeAreaScrollView>
  );
}
