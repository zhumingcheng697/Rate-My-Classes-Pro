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
import Header from "../../components/Header";

type ExploreSchoolScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-School"
>;

type ExploreSchoolScreenRouteProp = RouteProp<
  ExploreNavigationParamList,
  "Explore-School"
>;

export default function ExploreSchoolScreen() {
  const navigation = useNavigation<ExploreSchoolScreenNavigationProp>();
  const route = useRoute<ExploreSchoolScreenRouteProp>();

  return (
    <ScrollView background={"white"} minHeight={"full"} paddingY={"4px"}>
      <SafeAreaView edges={["left", "right"]}>
        <Header marginX={"10px"} marginTop={"6px"}>
          {route.params.schoolCode}
        </Header>

        <Grid margin={5} minChildrenWidth={140} childrenHeight={"90px"}>
          {["Integrated Digital Media", "Computer Science", "Math"].map(
            (school, index) => (
              <Button
                key={index}
                borderRadius={12}
                onPress={() => {
                  navigation.navigate("Explore-Department", {
                    schoolCode: route.params.schoolCode,
                    departmentCode: "DM",
                  });
                }}
              >
                {school}
              </Button>
            )
          )}
        </Grid>
      </SafeAreaView>
    </ScrollView>
  );
}
