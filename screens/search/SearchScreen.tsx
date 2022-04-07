import React, { useState, useCallback, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import { Text, Center, Divider, Box } from "native-base";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { inputSelectHeight } from "../../shared/theme";
import type { SearchNavigationParamList, ClassInfo } from "../../shared/types";
import { getFullClassCode } from "../../shared/utils";
import { searchClasses } from "../../shared/schedge";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import SearchBar from "../../components/SearchBar";
import TieredTextButton from "../../components/TieredTextButton";

type SearchScreenNavigationProp = StackNavigationProp<
  SearchNavigationParamList,
  "Search"
>;

const dividerHeight = 1;
const searchBarMargin = 10;
const delay = 500; // only make API call if idle for at least this amount of time

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [matchedClasses, setMatchedClass] = useState<ClassInfo[]>([]);
  const { selectedSemester } = useSelector((state) => state.settings);

  const { height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const search = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      let shouldDiscard = true;

      return (query: string, selectedSemester) => {
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
                  setMatchedClass(matches);
                  setIsLoaded(true);
                } else {
                  setMatchedClass([]);
                }
              })
              .catch((e) => {
                console.error(e);
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
    search(query, selectedSemester);
  }, [query, selectedSemester]);

  return (
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Divider height={`${dividerHeight}px`} />
      </Box>
      {focused || query ? (
        <Grid marginY={"10px"} isLoaded={isLoaded}>
          {(info) =>
            matchedClasses.map((classInfo, index) => {
              return (
                <TieredTextButton
                  key={index}
                  {...info}
                  primaryText={classInfo.name}
                  secondaryText={getFullClassCode(classInfo)}
                  onPress={() => {
                    navigation.navigate("Detail", classInfo);
                  }}
                />
              );
            })
          }
        </Grid>
      ) : (
        <Center
          height={`${
            height -
            headerHeight -
            tabBarHeight -
            inputSelectHeight -
            dividerHeight -
            searchBarMargin * 2
          }px`}
        >
          <Text textAlign={"center"} fontSize={"md"}>
            Search {selectedSemester.toString()} Classes
          </Text>
          <Text textAlign={"center"} fontSize={"sm"}>
            (By Title or Description)
          </Text>
        </Center>
      )}
    </KeyboardAwareSafeAreaScrollView>
  );
}
