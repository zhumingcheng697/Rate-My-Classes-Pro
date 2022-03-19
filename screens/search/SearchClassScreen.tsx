import { useState } from "react";
import { ScrollView, Text, Spacer, Pressable } from "native-base";
import { Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import type { SearchNavigationParamList, ClassCode } from "../../shared/types";
import { getClassCode } from "../../shared/utils";
import Grid from "../../containers/Grid";
import SearchBar from "../../components/SearchBar";
import TieredTextButton from "../../components/TieredTextButton";
import { SafeAreaView } from "react-native-safe-area-context";

type SearchClassScreenNavigationProp = StackNavigationProp<
  SearchNavigationParamList,
  "Search-Class"
>;

export default function SearchClassScreen() {
  const navigation = useNavigation<SearchClassScreenNavigationProp>();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <SafeAreaView edges={["left", "right"]}>
      <Pressable
        height={"100%"}
        isDisabled={!!query}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <SearchBar
          margin={"10px"}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {query ? (
          <ScrollView keyboardDismissMode={"on-drag"}>
            <Grid minChildrenWidth={140} childrenHeight={"90px"}>
              {["2193", "3193", "4193"].map((classNumber, index) => {
                const classCode: ClassCode = {
                  schoolCode: "UY",
                  departmentCode: "DM",
                  classNumber,
                };

                return (
                  <TieredTextButton
                    key={index}
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
              })}
            </Grid>
          </ScrollView>
        ) : (
          !focused && (
            <>
              <Spacer key={"spacer-top"} />
              <Text key={"text-center"} fontSize={15} textAlign={"center"}>
                Search Classes by Title or Description
              </Text>
              <Spacer key={"spacer-down"} />
            </>
          )
        )}
      </Pressable>
    </SafeAreaView>
  );
}
