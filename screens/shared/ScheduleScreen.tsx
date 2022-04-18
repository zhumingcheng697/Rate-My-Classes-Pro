import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HStack, Skeleton, Text, VStack } from "native-base";
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
import {
  getFullClassCode,
  getMeetingScheduleString,
  prepend,
  stripLineBreaks,
} from "../../libs/utils";
import AlertPopup from "../../components/AlertPopup";
import IconHStack from "../../components/IconHStack";

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

  const cleanText = useCallback(
    (text: string) =>
      text
        .replace(new RegExp(`^\s*${getFullClassCode(classInfo)}\s*`, "gi"), "")
        .replace(/^\s+/gi, ""),
    [classInfo]
  );

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
                    background={"background.secondary.light"}
                    _dark={{ background: "background.secondary.dark" }}
                  >
                    <HStack
                      flexWrap={"wrap"}
                      space={"5px"}
                      alignItems={"baseline"}
                      marginY={"-1px"}
                    >
                      <Text
                        fontSize={"xl"}
                        lineHeight={"1.15em"}
                        fontWeight={"semibold"}
                        marginY={"1px"}
                      >
                        {name}
                      </Text>
                      <Text
                        fontSize={"xl"}
                        lineHeight={"1.15em"}
                        marginY={"1px"}
                      >
                        ({getFullClassCode(classInfo)} {code})
                      </Text>
                    </HStack>
                    {!!instructors && !!instructors.length && (
                      <IconHStack
                        iconName={"school"}
                        text={instructors.join(", ")}
                      />
                    )}
                    {typeof maxUnits !== "undefined" && (
                      <IconHStack
                        iconName={"ribbon"}
                        text={
                          (!!maxUnits && !minUnits) || minUnits === maxUnits
                            ? `${maxUnits} Credit${maxUnits === 1 ? "" : "s"}`
                            : `${minUnits}–${maxUnits} Credits`
                        }
                      />
                    )}
                    {(!!campus || !!location) && (
                      <IconHStack
                        iconName={"location"}
                        text={[campus, location].join(": ")}
                      />
                    )}
                    {!!meetings && !!meetings.length && (
                      <IconHStack iconName={"time"}>
                        <VStack space={"2px"} flexShrink={1} flexGrow={1}>
                          {getMeetingScheduleString(
                            meetings.map(({ beginDate, minutesDuration }) => {
                              const begin = new Date(
                                beginDate.replace(
                                  /^(\d{4}-\d{1,2}-\d{1,2})\s+(\d{1,2}:\d{1,2})/i,
                                  "$1T$2"
                                )
                              );

                              const end = new Date(
                                begin.valueOf() + minutesDuration * 60 * 1000
                              );

                              return [begin, end];
                            })
                          ).map(([day, time], index) => (
                            <Text
                              fontSize={"md"}
                              lineHeight={"sm"}
                              key={day + time + index}
                            >
                              {day}: {time}
                            </Text>
                          ))}
                        </VStack>
                      </IconHStack>
                    )}
                    {!!prerequisites &&
                      stripLineBreaks(
                        prepend(cleanText(prerequisites), "Prerequisite", ": ")
                      )
                        .split(/\n/)
                        .map((prerequisite, index) => (
                          <Text
                            color={"gray.600"}
                            _dark={{ color: "gray.400" }}
                            key={"prerequisites" + index}
                            lineHeight={"md"}
                          >
                            {prerequisite}
                          </Text>
                        ))}
                    {!!notes &&
                      stripLineBreaks(prepend(cleanText(notes), "Notes", ": "))
                        .split(/\n/)
                        .map((note, index) => (
                          <Text
                            color={"gray.600"}
                            _dark={{ color: "gray.400" }}
                            key={"notes" + index}
                            lineHeight={"md"}
                          >
                            {note}
                          </Text>
                        ))}
                  </VStack>
                )
              )
            : [...Array(5)].map((_, index) => (
                <Skeleton borderRadius={10} height={"150px"} key={index} />
              ))}
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
