import { Input, Icon, ScrollView } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import type { SearchNavigationParamList, ClassCode } from "../../shared/types";
import Grid from "../../containers/Grid";
import { getClassCode } from "../../shared/utils";
import TieredTextButton from "../../components/TieredTextButton";
import { SafeAreaView } from "react-native-safe-area-context";

type SearchClassScreenNavigationProp = StackNavigationProp<
  SearchNavigationParamList,
  "Search-Class"
>;

export default function SearchClassScreen() {
  const navigation = useNavigation<SearchClassScreenNavigationProp>();

  return (
    <SafeAreaView edges={["left", "right"]}>
      <Input
        size={"lg"}
        margin={"10px"}
        borderWidth={1.5}
        placeholder={"Search Class Name or Description"}
        _focus={{ borderColor: "nyu.default" }}
        leftElement={
          <Icon
            marginLeft={"5px"}
            marginRight={"-5px"}
            size={"sm"}
            color={"gray.400"}
            as={<Ionicons name={"search"} />}
          />
        }
      ></Input>
      <ScrollView>
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
    </SafeAreaView>
  );
}
