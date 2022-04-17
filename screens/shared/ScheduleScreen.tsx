import React, { useEffect, useMemo, useState } from "react";
import { Text, VStack } from "native-base";
import { type StackNavigationProp } from "@react-navigation/stack";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { useSelector } from "react-redux";

import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Semester from "../../libs/semester";
import { SectionInfo, type SharedNavigationParamList } from "../../libs/types";
import { getSections } from "../../libs/schedge";
import { getFullClassCode, getFullDepartmentCode } from "../../libs/utils";
import AlertPopup from "../../components/AlertPopup";

type ScheduleScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Schedule"
>;

type ScheduleScreenRouteProp = RouteProp<SharedNavigationParamList, "Schedule">;

export default function ScheduleScreen() {
  const navigation = useNavigation<ScheduleScreenNavigationProp>();
  const route = useRoute<ScheduleScreenRouteProp>();
  const { semester, classInfo } = route.params;
  const settings = useSelector((state) => state.settings);
  const isFocused = useIsFocused();
  const [sections, setSections] = useState<SectionInfo[] | null>(
    route.params.sections
  );
  const [showAlert, setShowAlert] = useState(false);

  const selectedSemester = useMemo(
    () => new Semester(settings.selectedSemester),
    [settings.selectedSemester]
  );

  useEffect(() => {
    if (!Semester.equals(selectedSemester, new Semester(semester))) {
      getSections(classInfo, selectedSemester)
        .then((sections) => {
          if (!sections.length) {
            setShowAlert(true);
          }
          setSections(sections);
        })
        .catch(() => {
          setSections(null);
          setShowAlert(true);
        })
        .finally(() => {
          navigation.setParams({ semester: selectedSemester });
        });
    }
  }, [selectedSemester, isFocused]);

  const noDataErrorMessage = () => {
    const diff = Semester.between(
      Semester.predictCurrentSemester(),
      selectedSemester
    );

    return `${classInfo.name} (${getFullClassCode(classInfo)}) ${
      diff > 0
        ? "was not offered"
        : diff < 0
        ? "will not be offered"
        : "is not offered"
    } in ${selectedSemester.toString()}.`;
  };

  return (
    <>
      <AlertPopup
        isOpen={showAlert}
        header={sections ? "No Sections Offered" : "Unable to Load Schedule"}
        body={sections ? noDataErrorMessage() : undefined}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
      <KeyboardAwareSafeAreaScrollView>
        <VStack margin={"10px"} space={"10px"}>
          <Text>{JSON.stringify(sections, undefined, 4)}</Text>
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
