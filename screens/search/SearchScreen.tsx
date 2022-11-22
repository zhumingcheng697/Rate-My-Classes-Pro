import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Text, Center, Divider, Box, theme } from "native-base";
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import ClearableInput from "../../components/ClearableInput";
import AlertPopup from "../../components/AlertPopup";
import ClassesGrid from "../../components/ClassesGrid";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import type {
  ClassInfo,
  SharedNavigationParamList,
  DepartmentNameRecord,
  SearchNavigationParamList,
} from "../../libs/types";
import {
  useDimensions,
  useHandoff,
  useInnerHeight,
  useRefresh,
  useSemester,
} from "../../libs/hooks";
import { compareClasses, isObjectEmpty, Route } from "../../libs/utils";
import { searchClasses } from "../../libs/schedge";
import Semester from "../../libs/semester";
import { useAuth } from "../../mongodb/auth";
import colors from "../../styling/colors";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";
import { inputSelectHeight } from "../../styling/theme";

type SearchScreenNavigationProp =
  StackNavigationProp<SharedNavigationParamList>;

type SearchScreenRouteProp = RouteProp<SearchNavigationParamList, "Search">;

const dividerHeight = 1;
const searchBarMargin = 10;
const delay = 300; // only make API call if idle for at least this amount of time

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { params } = useRoute<SearchScreenRouteProp>();
  const [query, setQuery] = useState(params?.query || "");
  const [focused, setFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [matchedClasses, setMatchedClass] = useState<ClassInfo[]>([]);
  const settings = useSelector((state) => state.settings);
  const [searchPending, setIsSearchPending] = useState(false);
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const innerHeight = useInnerHeight();
  const { isSettingsSettled, db, isSemesterSettled, setIsSemesterSettled } =
    useAuth();
  const semesterInfo = useSemester({
    db,
    navigation,
    params,
    settings,
    isSettingsSettled,
    setIsSemesterSettled,
  });

  const semester = useMemo(() => new Semester(semesterInfo), [semesterInfo]);
  const isFocused = useIsFocused();

  const schoolCodes = useMemo(
    () => Object.keys(schoolNames ?? {}),
    [schoolNames]
  );

  useHandoff({
    isFocused,
    route: Route("SearchTab", "Search", params),
    title: `Search${
      query ? ` "${query}" ` : " "
    }Classes for ${semester.toString()}`,
    isReady: query ? !!matchedClasses.length : isSemesterSettled,
    timeout: query ? 500 : undefined,
  });

  const search = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      let id = {};

      return (
        query: string,
        selectedSemester: Semester,
        schoolCodes: string[],
        departmentNames: DepartmentNameRecord | null,
        failSilently: boolean = false
      ) => {
        clearTimeout(timeoutId);
        setIsLoaded(false);
        setMatchedClass([]);
        id = {};

        if (query) {
          navigation.setParams({ query });
          setIsLoaded(false);
          timeoutId = setTimeout(() => {
            const myId = {};
            id = myId;

            searchClasses(query, selectedSemester)
              .then((matches) => {
                if (id === myId) {
                  if (
                    schoolCodes.length &&
                    departmentNames &&
                    !isObjectEmpty(departmentNames)
                  ) {
                    matches.sort((a, b) =>
                      compareClasses(departmentNames, a, b)
                    );
                  }
                  setMatchedClass(matches);
                  setIsLoaded(true);
                } else {
                  setIsSearchPending(true);
                }
                setShowAlert(false);
                setSearchFailed(false);
              })
              .catch((e) => {
                console.error(e);
                setMatchedClass([]);
                if (!failSilently) setShowAlert(true);
                setSearchFailed(true);
              });
          }, delay);
        } else {
          navigation.setParams({ query: undefined });
          setIsLoaded(true);
          setShowAlert(false);
          setSearchFailed(false);
        }
      };
    })(),
    []
  );

  useEffect(() => {
    if (schoolNames && departmentNames && isSettingsSettled) {
      search(query, semester, schoolCodes, departmentNames);
      setIsSearchPending(false);
    }
  }, [query, semester, schoolCodes, departmentNames, isSettingsSettled]);

  useEffect(() => {
    if (searchPending) {
      search(query, semester, schoolCodes, departmentNames);
      setIsSearchPending(false);
    }
  }, [searchPending]);

  useRefresh(
    !(searchFailed && isSettingsSettled && schoolNames && departmentNames)
      ? undefined
      : (reason) => {
          search(
            query,
            semester,
            schoolCodes,
            departmentNames,
            reason === "NetInfo"
          );
          setIsSearchPending(false);
        }
  );

  const { width } = useDimensions();

  return (
    <>
      <AlertPopup
        autoDismiss
        header={"Unable to Load Classes"}
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
          setIsLoaded(true);
        }}
      />
      <KeyboardAwareSafeAreaScrollView
        wrapChildrenInIndividualSafeAreaViews
        keyboardAwareScrollViewProps={{
          keyboardDismissMode: "on-drag",
          scrollEnabled: !!query,
          stickyHeaderIndices: [0],
          enableAutomaticScroll: false,
          enableResetScrollToCoords: false,
        }}
      >
        <Box
          {...colorModeResponsiveStyle((selector) => ({
            background: selector(colors.background.primary),
          }))}
        >
          <ClearableInput
            isSearchBar
            margin={`${searchBarMargin}px`}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={() => {
              if (!matchedClasses.length)
                search(query, semester, schoolCodes, departmentNames);
            }}
          />
          <Divider minWidth={width} alignSelf={"center"} />
        </Box>
        {focused ||
        matchedClasses.length ||
        (query && (!isLoaded || !isSettingsSettled)) ? (
          <ClassesGrid
            query={query}
            marginY={"10px"}
            isLoaded={isLoaded && isSettingsSettled}
            classes={matchedClasses}
            navigation={navigation}
            semesterInfo={semesterInfo}
          />
        ) : (
          <Center
            marginX={"10px"}
            height={`${
              innerHeight -
              inputSelectHeight -
              dividerHeight -
              searchBarMargin * 2
            }px`}
          >
            <Text
              textAlign={"center"}
              fontWeight={"medium"}
              fontSize={"17px"}
              {...colorModeResponsiveStyle((selector) => ({
                color: selector({
                  light: theme.colors.gray[500],
                  dark: theme.colors.gray[400],
                }),
              }))}
            >
              {query
                ? searchFailed
                  ? "Unable to Load Classes"
                  : `No Matches Found for ${semester.toString()}`
                : `Search Classes${
                    isSettingsSettled ? ` for ${semester.toString()}` : ""
                  }`}
            </Text>
          </Center>
        )}
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
