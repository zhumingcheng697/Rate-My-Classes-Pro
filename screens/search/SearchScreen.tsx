import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Keyboard, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import { Text, Center, Divider, Box } from "native-base";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { inputSelectHeight } from "../../shared/theme";
import type {
  ClassInfo,
  StackNavigationSharedParamList,
  DepartmentNameRecord,
} from "../../shared/types";
import { compareClasses, isObjectEmpty } from "../../shared/utils";
import { searchClasses } from "../../shared/schedge";
import Semester from "../../shared/semester";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import SearchBar from "../../components/SearchBar";
import AlertPopup from "../../components/AlertPopup";
import ClassesGrid from "../../components/ClassesGrid";

type SearchScreenNavigationProp =
  StackNavigationProp<StackNavigationSharedParamList>;

const dividerHeight = 1;
const searchBarMargin = 10;
const delay = 500; // only make API call if idle for at least this amount of time

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [matchedClasses, setMatchedClass] = useState<ClassInfo[]>([]);
  const { selectedSemester } = useSelector((state) => state.settings);
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);

  const { height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

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
                Keyboard.dismiss();
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
    search(query, selectedSemester, schoolCodes, departmentNames);
  }, [query, selectedSemester, schoolCodes, departmentNames]);

  return (
    <>
      <AlertPopup
        avoidKeyboard={true}
        isOpen={searchFailed}
        onClose={() => {
          setSearchFailed(false);
          setIsLoaded(true);
        }}
      />
      <KeyboardAwareSafeAreaScrollView
        wrapChildrenInIndividualSafeAreaViews={true}
        keyboardAwareScrollViewProps={{
          keyboardDismissMode: "on-drag",
          scrollEnabled: !!query,
          stickyHeaderIndices: [0],
          enableAutomaticScroll: false,
          enableResetScrollToCoords: false,
        }}
      >
        <Box background={"background.primary"}>
          <SearchBar
            height={`${inputSelectHeight}px`}
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
          <Divider height={`${dividerHeight}px`} />
        </Box>
        {focused || matchedClasses.length || !isLoaded ? (
          <ClassesGrid
            marginY={"10px"}
            isLoaded={isLoaded}
            classes={matchedClasses}
            navigation={navigation}
          />
        ) : (
          <Center
            marginX={"10px"}
            height={`${
              height -
              headerHeight -
              tabBarHeight -
              inputSelectHeight -
              dividerHeight -
              searchBarMargin * 2
            }px`}
          >
            <Text
              textAlign={"center"}
              color={"gray.500"}
              fontWeight={"medium"}
              fontSize={"md"}
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
