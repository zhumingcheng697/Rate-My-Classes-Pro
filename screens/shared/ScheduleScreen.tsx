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
import { useClassInfoLoader, useRefresh, useSemester } from "../../libs/hooks";
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
  const { params } = useRoute<ScheduleScreenRouteProp>();
  const { classCode } = params;
  const settings = useSelector((state) => state.settings);
  const [sections, setSections] = useState<SectionInfo[] | null>(
    params.sections ?? null
  );
  const [showAlert, setShowAlert] = useState(false);
  const { db, isSettingsSettled } = useAuth();

  const cleanText = useCallback(
    (text: string) =>
      text
        .replace(new RegExp(`^\s*${getFullClassCode(classCode)}\s*`, "gi"), "")
        .replace(/^\s+/gi, ""),
    [classCode]
  );

  const semesterInfo = useSemester({
    db,
    navigation,
    params,
    settings,
    isSettingsSettled,
  });

  const semester = useMemo(
    () => new Semester(semesterInfo),
    [semesterInfo.semesterCode, semesterInfo.year]
  );

  const { classInfo, classInfoError, reloadClassInfo } = useClassInfoLoader(
    classCode,
    semesterInfo,
    isSettingsSettled || !!params.semester || !!params.semester
  );

  const notOffered = !!sections || classInfoError === ErrorType.noData;

  useEffect(() => {
    if (!classInfoError && sections && sections.length && showAlert) {
      setShowAlert(false);
    }
  }, [classInfoError, sections, showAlert]);

  const fetchSections = useCallback(
    (failSilently: boolean = false) => {
      if (!(isSettingsSettled || params.semester) || !classInfo) return;

      getSections(classInfo, semesterInfo)
        .then((sections) => {
          setSections(sections);
          if (!sections.length) {
            setShowAlert(true);
          } else {
            setShowAlert(false);
          }
        })
        .catch(() => {
          setSections(null);
          if (!failSilently) setShowAlert(true);
        });
    },
    [isSettingsSettled, classInfo, semester, navigation]
  );

  useEffect(fetchSections, [semester, isSettingsSettled, classInfo]);

  useRefresh((reason) => {
    const failSilently = reason === "NetInfo";
    if (reloadClassInfo) {
      reloadClassInfo?.(failSilently);
    } else if (classInfo && !sections) {
      fetchSections(failSilently);
    }
  });

  return (
    <>
      <AlertPopup
        isOpen={showAlert && notOffered}
        header={"No Sections Offered"}
        body={notOfferedMessage(classCode, classInfo, semester)}
        onClose={() => {
          setShowAlert(false);
          navigation.pop(classInfoError === ErrorType.noData ? 2 : 1);
        }}
      />
      <AlertPopup
        autoDismiss
        isOpen={showAlert && !notOffered}
        header={"Unable to Load Schedule"}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
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
