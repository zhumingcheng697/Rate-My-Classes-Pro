import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HStack, Skeleton, Text, theme, VStack } from "native-base";
import { type StackNavigationProp } from "@react-navigation/stack";
import {
  useIsFocused,
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
  type ClassCode,
  type ClassInfo,
  type SectionInfo,
  type SharedNavigationParamList,
} from "../../libs/types";
import {
  useClassInfoLoader,
  useHandoff,
  useInitialTabName,
  useRefresh,
  useSemester,
} from "../../libs/hooks";
import Schedge from "../../libs/schedge";
import {
  getFullClassCode,
  getMeetingScheduleString,
  notOfferedMessage,
  prepend,
  Route,
  stripLineBreaks,
} from "../../libs/utils";
import { useAuth } from "../../mongodb/auth";
import colors from "../../styling/colors";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";

type SectionViewProps = {
  classCode: ClassCode;
  classInfo?: ClassInfo | null;
  sectionInfo: SectionInfo;
  cleanText: (text: string) => string;
};

function SectionView({
  classCode,
  classInfo,
  sectionInfo,
  cleanText,
}: SectionViewProps) {
  const {
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
  } = sectionInfo;

  const meetingStrToDate = useCallback(
    ({
      beginDate,
      minutesDuration,
    }: Exclude<SectionInfo["meetings"], undefined>[number]) => {
      const begin: Date = new Date(
        beginDate.replace(
          /^(\d{4}-\d{1,2}-\d{1,2})\s+(\d{1,2}:\d{1,2})/i,
          "$1T$2"
        )
      );

      const end: Date = new Date(begin.valueOf() + minutesDuration * 60 * 1000);

      return [begin, end] as [Date, Date];
    },
    []
  );

  const dayTimeToText = useCallback(
    ([day, time]: [string, string], index: number) => (
      <Text fontSize={"md"} lineHeight={"sm"} key={day + time + index}>
        {day}: {time}
      </Text>
    ),
    []
  );

  const itemToText = useCallback(
    (kind: string, itemToText: string, index: number) => (
      <Text
        key={kind + index}
        lineHeight={"md"}
        {...colorModeResponsiveStyle((selector) => ({
          color: selector({
            light: theme.colors.gray[600],
            dark: theme.colors.gray[400],
          }),
        }))}
      >
        {itemToText}
      </Text>
    ),
    []
  );

  const prereqToText = useCallback(
    (prereq: string, index: number) => itemToText("prereq", prereq, index),
    [itemToText]
  );

  const noteToText = useCallback(
    (note: string, index: number) => itemToText("note", note, index),
    [itemToText]
  );

  return (
    <VStack
      space={"5px"}
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
          {name || (classInfo?.name ?? getFullClassCode(classCode))}
        </Text>
        <Text fontSize={"xl"} lineHeight={"1.15em"} marginY={"1px"}>
          ({[getFullClassCode(classCode), code].filter(Boolean).join(" ")})
        </Text>
      </HStack>
      <VStack space={"3px"}>
        {!!instructors && !!instructors.length && (
          <IconHStack iconName={"school"} text={instructors.join(", ")} />
        )}
        {!!maxUnits && (
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
        {!!status && <IconHStack iconName={"golf"} text={status} />}
        {(!!campus || !!location) && (
          <IconHStack
            iconName={"location"}
            text={[campus, location].filter(Boolean).join(": ")}
          />
        )}
        {!!meetings && !!meetings.length && (
          <IconHStack iconName={"time"}>
            <VStack space={"2px"} flexShrink={1} flexGrow={1}>
              {getMeetingScheduleString(meetings.map(meetingStrToDate)).map(
                dayTimeToText
              )}
            </VStack>
          </IconHStack>
        )}
      </VStack>
      {!!prerequisites &&
        stripLineBreaks(prepend(cleanText(prerequisites), "Prerequisite", ": "))
          .split(/\n/)
          .map(prereqToText)}
      {!!notes &&
        stripLineBreaks(prepend(cleanText(notes), "Notes", ": "))
          .split(/\n/)
          .map(noteToText)}
    </VStack>
  );
}

type ScheduleScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Schedule"
>;

type ScheduleScreenRouteProp = RouteProp<SharedNavigationParamList, "Schedule">;

export default function ScheduleScreen() {
  const navigation = useNavigation<ScheduleScreenNavigationProp>();
  const { params } = useRoute<ScheduleScreenRouteProp>();
  const starredClassRecord = useSelector((state) => state.starredClassRecord);
  const reviewedClassRecord = useSelector((state) => state.reviewedClassRecord);
  const { classCode } = params;
  const settings = useSelector((state) => state.settings);
  const [sections, setSections] = useState<SectionInfo[] | null>(
    params.sections ?? null
  );
  const [showAlert, setShowAlert] = useState(false);
  const { db, isSettingsSettled, isSemesterSettled, setIsSemesterSettled } =
    useAuth();
  const isFocused = useIsFocused();
  const tabName = useInitialTabName();

  const cleanText = useCallback(
    (text: string) =>
      text
        .replace(
          new RegExp(`^\\s*${getFullClassCode(classCode)}\\s*`, "gi"),
          ""
        )
        .replace(/^\s+/gi, ""),
    [classCode]
  );

  const semesterInfo = useSemester({
    db,
    navigation,
    params,
    settings,
    isSettingsSettled,
    setIsSemesterSettled,
  });

  const semester = useMemo(
    () => new Semester(semesterInfo),
    [semesterInfo.semesterCode, semesterInfo.year]
  );

  useHandoff({
    isFocused,
    route: Route(tabName, "Schedule", params),
    title: `View ${getFullClassCode(
      classCode
    )} Schedule for ${semester.toString()}`,
    isReady: !!params.semester || (isSemesterSettled && isSettingsSettled),
  });

  const { classInfo, classInfoError, scheduleLoaded, reloadClassInfo } =
    useClassInfoLoader(
      {
        classCode,
        semester: semesterInfo,
        isSemesterSettled: isSettingsSettled || !!params.semester,
        isSettingsSettled,
        starredClassRecord,
        reviewedClassRecord,
      },
      !classCode.name && !sections
    );

  const resolvedSections =
    sections || (scheduleLoaded && classInfo?.sections) || null;

  const notOffered = !!resolvedSections || classInfoError === ErrorType.noData;

  useEffect(() => {
    if (
      !classInfoError &&
      resolvedSections &&
      resolvedSections.length &&
      showAlert
    ) {
      setShowAlert(false);
    }
  }, [classInfoError, resolvedSections]);

  useEffect(() => {
    if ((scheduleLoaded && !classInfo?.sections.length) || classInfoError) {
      setShowAlert(true);
    }
  }, [scheduleLoaded, classInfo, classInfoError]);

  const firstFetched = useRef(false);

  const fetchSections = useCallback(
    (failSilently: boolean = false) => {
      if (!(isSettingsSettled || params.semester) || !classInfo) return;

      if (!firstFetched.current) {
        firstFetched.current = true;
        if (sections) return;
      }

      if (!classCode.name && !sections) return;

      Schedge.getSections(classInfo, semesterInfo)
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
    [isSettingsSettled, classInfo, semesterInfo]
  );

  const duplicateIndices = useMemo(() => {
    if (!resolvedSections || !resolvedSections.length) {
      return new Set<number>();
    }

    const duplicateIndices = new Set<number>();
    const sectionKeys = new Set<string>();
    const findDuplicate = (e: SectionInfo, index: number) => {
      const key = `${e.name}-${e.code}`;
      if (sectionKeys.has(key)) {
        duplicateIndices.add(index);
      } else {
        sectionKeys.add(key);
      }
    };

    resolvedSections.forEach(findDuplicate);
    return duplicateIndices;
  }, [resolvedSections]);

  useEffect(fetchSections, [semester, isSettingsSettled, classInfo]);

  useRefresh((reason) => {
    const failSilently = reason === "NetInfo";
    if (reloadClassInfo) {
      reloadClassInfo?.(failSilently);
    } else if (classInfo && !resolvedSections) {
      fetchSections(failSilently);
    }
  });

  const recToSectionView = useCallback(
    (
      recitationInfo: Exclude<SectionInfo["recitations"], undefined>[number],
      i: number
    ) => (
      <SectionView
        key={recitationInfo.code + "-" + i}
        classCode={classCode}
        classInfo={classInfo}
        sectionInfo={recitationInfo}
        cleanText={cleanText}
      />
    ),
    [classCode, classInfo, cleanText]
  );

  const sectionToSectionView = useCallback(
    (sectionInfo: SectionInfo, index: number) =>
      duplicateIndices.has(index) ? null : (
        <VStack space={"10px"} key={getFullClassCode(classCode) + "-" + index}>
          <SectionView
            classCode={classCode}
            classInfo={classInfo}
            sectionInfo={sectionInfo}
            cleanText={cleanText}
          />
          {sectionInfo.recitations &&
            sectionInfo.recitations.map(recToSectionView)}
        </VStack>
      ),
    [duplicateIndices, classCode, classInfo, cleanText]
  );

  const skeletons = useMemo(
    () => (
      <>
        <Skeleton borderRadius={10} height={"150px"} />
        <Skeleton borderRadius={10} height={"150px"} />
        <Skeleton borderRadius={10} height={"150px"} />
        <Skeleton borderRadius={10} height={"150px"} />
        <Skeleton borderRadius={10} height={"150px"} />
      </>
    ),
    []
  );

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
          {resolvedSections && resolvedSections.length
            ? resolvedSections.map(sectionToSectionView)
            : skeletons}
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
