import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Text, Center, Divider, Box, theme } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { inputSelectHeight } from "../../libs/theme";
import type {
  ClassInfo,
  SharedNavigationParamList,
  DepartmentNameRecord,
} from "../../libs/types";
import { compareClasses, isObjectEmpty } from "../../libs/utils";
import { searchClasses } from "../../libs/schedge";
import Semester from "../../libs/semester";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import ClearableInput from "../../components/ClearableInput";
import AlertPopup from "../../components/AlertPopup";
import ClassesGrid from "../../components/ClassesGrid";
import { useDimensions, useInnerHeight } from "../../libs/hooks";
import { useAuth } from "../../mongodb/auth";
import colors from "../../libs/colors";
import { colorModeResponsiveStyle } from "../../libs/color-mode-utils";

type SearchScreenNavigationProp =
  StackNavigationProp<SharedNavigationParamList>;

const dividerHeight = 1;
const searchBarMargin = 10;
const delay = 250; // only make API call if idle for at least this amount of time

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [matchedClasses, setMatchedClass] = useState<ClassInfo[]>([]);
  const settings = useSelector((state) => state.settings);
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const innerHeight = useInnerHeight();
  const auth = useAuth();

  const selectedSemester = useMemo(
    () => new Semester(settings.selectedSemester),
    [settings.selectedSemester]
  );

  const schoolCodes = useMemo(
    () => Object.keys(schoolNames ?? {}),
    [schoolNames]
  );

  const search = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      let shouldDiscard = true;

      return (
        query: string,
        selectedSemester: Semester,
        schoolCodes: string[],
        departmentNames: DepartmentNameRecord | null
      ) => {
        clearTimeout(timeoutId);
        setMatchedClass([]);
        shouldDiscard = true;

        if (query) {
          setIsLoaded(false);
          timeoutId = setTimeout(() => {
            shouldDiscard = false;

            searchClasses(query, selectedSemester)
              .then((matches) => {
                if (!shouldDiscard) {
                  if (
                    schoolCodes.length &&
                    departmentNames &&
                    !isObjectEmpty(departmentNames)
                  ) {
                    matches.sort((a, b) =>
                      compareClasses(schoolCodes, departmentNames, a, b)
                    );
                  }
                  setMatchedClass(matches);
                  setIsLoaded(true);
                } else {
                  setMatchedClass([]);
                }
              })
              .catch((e) => {
                console.error(e);
                setMatchedClass([]);
                setSearchFailed(true);
              });
          }, delay);
        } else {
          setIsLoaded(true);
        }
      };
    })(),
    []
  );

  useEffect(() => {
    if (auth.isSettingsSettled)
      search(query, selectedSemester, schoolCodes, departmentNames);
  }, [
    query,
    selectedSemester,
    schoolCodes,
    departmentNames,
    auth.isSettingsSettled,
  ]);

  const { width } = useDimensions();

  return (
    <>
      <AlertPopup
        isOpen={searchFailed}
        onClose={() => {
          setSearchFailed(false);
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
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
            onSubmitEditing={() => {
              if (!matchedClasses.length)
                search(query, selectedSemester, schoolCodes, departmentNames);
            }}
          />
          <Divider
            minWidth={width}
            alignSelf={"center"}
            height={`${dividerHeight}px`}
            {...colorModeResponsiveStyle((selector) => ({
              background: selector(colors.border.subtle),
            }))}
          />
        </Box>
        {focused ||
        matchedClasses.length ||
        (query && (!isLoaded || !auth.isSettingsSettled)) ? (
          <ClassesGrid
            marginY={"10px"}
            isLoaded={isLoaded && auth.isSettingsSettled}
            classes={matchedClasses}
            navigation={navigation}
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
                ? `No Matches Found in ${selectedSemester.toString()}`
                : `Search ${selectedSemester.toString()} Classes`}
            </Text>
          </Center>
        )}
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
