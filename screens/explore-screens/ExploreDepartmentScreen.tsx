import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, Button } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type ExploreNavigationParamList } from "../../shared/types";
import Grid from "../../components/Grid";

type ExploreDepartmentScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-Department"
>;

type ExploreDepartmentScreenRouteProp = RouteProp<
  ExploreNavigationParamList,
  "Explore-Department"
>;

export default function ExploreDepartmentScreen() {
  const navigation = useNavigation<ExploreDepartmentScreenNavigationProp>();
  const route = useRoute<ExploreDepartmentScreenRouteProp>();

  return (
    <ScrollView>
      <SafeAreaView edges={["left", "right"]}>
        <Text variant={"h1"}>{route.params.departmentCode}</Text>
        <Text variant={"h2"}>{route.params.schoolCode}</Text>

        <Grid minChildrenWidth={140} childrenHeight={"90px"}>
          {["2193", "3193", "4193"].map((classNumber, index) => (
            <Button
              key={index}
              borderRadius={12}
              onPress={() => {
                navigation.navigate("Explore-Detail", {
                  schoolCode: route.params.schoolCode,
                  departmentCode: "DM",
                  classNumber,
                  name: classNumber,
                  description: "",
                });
              }}
            >
              {classNumber}
            </Button>
          ))}
        </Grid>
      </SafeAreaView>
    </ScrollView>
  );
}
