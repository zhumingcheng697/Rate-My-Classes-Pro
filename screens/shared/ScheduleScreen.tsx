import React, { useEffect, useMemo, useState } from "react";
import { Box, Skeleton, Text, VStack } from "native-base";
import { type StackNavigationProp } from "@react-navigation/stack";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { useSelector } from "react-redux";

import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Semester from "../../libs/semester";
import { SectionInfo, type SharedNavigationParamList } from "../../libs/types";
import { getSections } from "../../libs/schedge";
import { getFullClassCode, prepend, stripLineBreaks } from "../../libs/utils";
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
  }, [selectedSemester]);

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
          {sections && sections.length
            ? sections.map(
                (
                  {
                    code,
                    instructors,
                    meetings,
                    name,
                    campus,
                    minUnits,
                    maxUnits,
                    location,
                    notes,
                    prerequisites,
                  },
                  index
                ) => (
                  <VStack
                    space={"5px"}
                    key={index}
                    padding={"10px"}
                    borderRadius={10}
                    background={"background.secondary"}
                  >
                    <Box>
                      <Text fontSize={"xl"} fontWeight={"semibold"}>
                        {name} ({code})
                      </Text>
                      {!!instructors && !!instructors.length && (
                        <Text fontSize={"md"}>{instructors.join(", ")}</Text>
                      )}
                      {(!!campus || !!location) && (
                        <Text fontSize={"md"}>
                          {[campus, location].join(": ")}
                        </Text>
                      )}

                      {!!meetings &&
                        !!meetings.length &&
                        meetings.map((meeting, index) => {
                          const begin = new Date(
                            meeting.beginDate.replace(
                              /^(\d{4}-\d{1,2}-\d{1,2})\s+(\d{1,2}:\d{1,2})/i,
                              "$1T$2"
                            )
                          );

                          return (
                            <Text fontSize={"md"} key={"meeting" + index}>
                              {begin.toLocaleString(undefined, {
                                weekday: "long",
                              })}{" "}
                              {begin.toLocaleString(undefined, {
                                hour12: true,
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                              –
                              {new Date(
                                begin.valueOf() +
                                  meeting.minutesDuration * 60 * 1000
                              ).toLocaleString(undefined, {
                                hour12: true,
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </Text>
                          );
                        })}
                      <Text fontSize={"md"}>
                        {!!maxUnits && (!minUnits || minUnits === maxUnits)
                          ? `${maxUnits} Credit${maxUnits === 1 ? "" : "s"}`
                          : `${minUnits}–${maxUnits} Credits`}
                      </Text>
                    </Box>
                    {!!prerequisites &&
                      stripLineBreaks(
                        prepend(prerequisites, "Prerequisite", ": ")
                      )
                        .split(/\s*\n\s*/)
                        .map((prerequisite, index) => (
                          <Text
                            color={"gray.600"}
                            key={"prerequisites" + index}
                            lineHeight={"md"}
                          >
                            {prerequisite}
                          </Text>
                        ))}
                    {!!notes &&
                      stripLineBreaks(prepend(notes, "Notes", ": "))
                        .split(/\s*\n\s*/)
                        .map((note, index) => (
                          <Text
                            color={"gray.600"}
                            key={"notes" + index}
                            lineHeight={"md"}
                          >
                            {note}
                          </Text>
                        ))}
                  </VStack>
                )
              )
            : [...Array(3)].map((_, index) => (
                <Skeleton borderRadius={10} height={"120px"} key={index} />
              ))}
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
