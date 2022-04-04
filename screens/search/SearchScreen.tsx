import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Center, Divider, Box } from "native-base";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import type { SearchNavigationParamList, ClassCode } from "../../shared/types";
import { getFullClassCode, placeholderClassNumbers } from "../../shared/utils";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import SearchBar from "../../components/SearchBar";
import TieredTextButton from "../../components/TieredTextButton";

type SearchScreenNavigationProp = StackNavigationProp<
  SearchNavigationParamList,
  "Search"
>;

const searchBarHeight = 39;
const dividerHeight = 1;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

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
          height={`${searchBarHeight}px`}
          margin={"10px"}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Divider height={`${dividerHeight}px`} />
      </Box>
      {query ? (
        <Grid marginY={"10px"}>
          {(info) =>
            placeholderClassNumbers.map((classNumber, index) => {
              const classCode: ClassCode = {
                schoolCode: "UY",
                departmentCode: "DM",
                classNumber,
              };

              return (
                <TieredTextButton
                  key={index}
                  {...info}
                  primaryText={"Lorem ipsum dolor sit amet"}
                  secondaryText={getFullClassCode(classCode)}
                  onPress={() => {
                    navigation.navigate("Detail", {
                      ...classCode,
                      name: classNumber,
                      description:
                        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas modi explicabo fuga, eum libero ipsum magnam. Dolores, vel vero nobis doloribus voluptatibus soluta ratione adipisci repellat voluptatem libero ipsam rerum.",
                    });
                  }}
                />
              );
            })
          }
        </Grid>
      ) : (
        !focused && (
          <Center
            height={`${
              height -
              insets.top -
              insets.bottom -
              headerHeight -
              tabBarHeight -
              searchBarHeight -
              dividerHeight
            }px`}
          >
            <Text textAlign={"center"}>
              Search Classes by Title or Description
            </Text>
          </Center>
        )
      )}
    </KeyboardAwareSafeAreaScrollView>
  );
}
