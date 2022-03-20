import { useState } from "react";
import { ScrollView, Text, Pressable, Center, Divider } from "native-base";
import { Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import type { SearchNavigationParamList, ClassCode } from "../../shared/types";
import { getClassCode, placeholderClassNumbers } from "../../shared/utils";
import Grid from "../../containers/Grid";
import SearchBar from "../../components/SearchBar";
import TieredTextButton from "../../components/TieredTextButton";
import { SafeAreaView } from "react-native-safe-area-context";

type SearchClassScreenNavigationProp = StackNavigationProp<
  SearchNavigationParamList,
  "Search-Class"
>;

const searchBarHeight = 38;
const dividerHeight = 1;

export default function SearchClassScreen() {
  const navigation = useNavigation<SearchClassScreenNavigationProp>();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <SafeAreaView edges={["left", "right"]}>
      <Pressable
        paddingBottom={`${searchBarHeight + dividerHeight + 20}px`}
        height={"100%"}
        isDisabled={!!query}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <SearchBar
          height={`${searchBarHeight}px`}
          margin={"10px"}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Divider height={`${dividerHeight}px`} />
        {query ? (
          <ScrollView height={"100%"} keyboardDismissMode={"on-drag"}>
            <Grid
              marginTop={"5px"}
              marginBottom={"10px"}
              minChildrenWidth={140}
              childrenHeight={"90px"}
            >
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
                      secondaryText={getClassCode(classCode)}
                      onPress={() => {
                        navigation.navigate("Search-Detail", {
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
          </ScrollView>
        ) : (
          !focused && (
            <Center height={"100%"}>
              <Text textAlign={"center"}>
                Search Classes by Title or Description
              </Text>
            </Center>
          )
        )}
      </Pressable>
    </SafeAreaView>
  );
}
