import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HStack, Skeleton, Text, theme, VStack } from "native-base";
import { type StackNavigationProp } from "@react-navigation/stack";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { useSelector } from "react-redux";

import AlertPopup from "../../components/AlertPopup";
import IconHStack from "../../components/IconHStack";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Semester from "../../libs/semester";
import {
  ErrorType,
  type SectionInfo,
  type SharedNavigationParamList,
} from "../../libs/types";
import { useClassInfoLoader } from "../../libs/hooks";
import { getSections } from "../../libs/schedge";
import {
  getFullClassCode,
  getMeetingScheduleString,
  notOfferedMessage,
  prepend,
  stripLineBreaks,
} from "../../libs/utils";
import { useAuth } from "../../mongodb/auth";
import colors from "../../styling/colors";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";

type ScheduleScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Schedule"
>;

type ScheduleScreenRouteProp = RouteProp<SharedNavigationParamList, "Schedule">;

export default function ScheduleScreen() {
  const navigation = useNavigation<ScheduleScreenNavigationProp>();
  const route = useRoute<ScheduleScreenRouteProp>();
  const { semester, classCode } = route.params;
  const settings = useSelector((state) => state.settings);
  const [sections, setSections] = useState<SectionInfo[] | null>(
    route.params.sections ?? null
  );
  const [showAlert, setShowAlert] = useState(false);
  const auth = useAuth();

  const cleanText = useCallback(
    (text: string) =>
      text
        .replace(new RegExp(`^\s*${getFullClassCode(classCode)}\s*`, "gi"), "")
        .replace(/^\s+/gi, ""),
    [classCode]
  );

  const selectedSemester = useMemo(
    () => new Semester(settings.selectedSemester),
    [settings.selectedSemester]
  );

  const { classInfo, classInfoError } = useClassInfoLoader(
    classCode,
    settings.selectedSemester,
    auth.isSettingsSettled
  );

  const notOffered = !!sections || classInfoError === ErrorType.noData;

  useEffect(() => {
    if (!classInfoError && sections && sections.length) {
      setShowAlert(false);
    }
  }, [classInfoError, sections]);

  useEffect(() => {
    if (!classInfo && classInfoError) {
      setShowAlert(true);
      navigation.setParams({ semester: selectedSemester });
      return;
    }
  }, [classInfo, classInfoError]);

  useEffect(() => {
    if (!auth.isSettingsSettled || !classInfo) return;

    if (
      !Semester.equals(selectedSemester, new Semester(semester)) ||
      !sections
    ) {
      getSections(classInfo, settings.selectedSemester)
        .then((sections) => {
          setSections(sections);
          if (!sections.length) {
            setShowAlert(true);
          }
        })
        .catch(() => {
          setSections(null);
          setShowAlert(true);
        })
        .finally(() => {
          navigation.setParams({ semester: selectedSemester });
        });
    }
  }, [selectedSemester, auth.isSettingsSettled, classInfo]);

  return (
    <>
      <AlertPopup
        isOpen={showAlert}
        header={notOffered ? "No Sections Offered" : "Unable to Load Schedule"}
        body={
          notOffered
            ? notOfferedMessage(classCode, classInfo, selectedSemester)
            : undefined
        }
        onClose={() => {
          setShowAlert(false);
          navigation.pop(classInfoError === ErrorType.noData ? 2 : 1);
        }}
      />
      <KeyboardAwareSafeAreaScrollView>
        <VStack marginX={"10px"} marginY={"15px"} space={"10px"}>
          {sections && sections.length
            ? sections.map(
                (
                  {
                    code,
                    instructors,
                    type,
                    status,
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
                    {...colorModeResponsiveStyle((selector) => ({
                      background: selector(colors.background.secondary),
                    }))}
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
                        {name ||
                          (classInfo?.name ?? getFullClassCode(classCode))}
                      </Text>
                      <Text
                        fontSize={"xl"}
                        lineHeight={"1.15em"}
                        marginY={"1px"}
                      >
                        ({[getFullClassCode(classCode), code].join(" ")})
                      </Text>
                    </HStack>
                    <VStack space={"3px"}>
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
                      {!!type && <IconHStack iconName={"easel"} text={type} />}
                      {!!status && (
                        <IconHStack iconName={"golf"} text={status} />
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
                                const begin: Date = new Date(
                                  beginDate.replace(
                                    /^(\d{4}-\d{1,2}-\d{1,2})\s+(\d{1,2}:\d{1,2})/i,
                                    "$1T$2"
                                  )
                                );

                                const end: Date = new Date(
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
                    </VStack>
                    {!!prerequisites &&
                      stripLineBreaks(
                        prepend(cleanText(prerequisites), "Prerequisite", ": ")
                      )
                        .split(/\n/)
                        .map((prerequisite, index) => (
                          <Text
                            key={"prerequisites" + index}
                            lineHeight={"md"}
                            {...colorModeResponsiveStyle((selector) => ({
                              color: selector({
                                light: theme.colors.gray[600],
                                dark: theme.colors.gray[400],
                              }),
                            }))}
                          >
                            {prerequisite}
                          </Text>
                        ))}
                    {!!notes &&
                      stripLineBreaks(prepend(cleanText(notes), "Notes", ": "))
                        .split(/\n/)
                        .map((note, index) => (
                          <Text
                            key={"notes" + index}
                            lineHeight={"md"}
                            {...colorModeResponsiveStyle((selector) => ({
                              color: selector({
                                light: theme.colors.gray[600],
                                dark: theme.colors.gray[400],
                              }),
                            }))}
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
