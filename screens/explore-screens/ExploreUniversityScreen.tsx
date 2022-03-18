import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type ExploreNavigationParamList } from "../../shared/types";
import Grid from "../../components/Grid";
import Header from "../../components/Header";

type ExploreUniversityScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-University"
>;

export default function ExploreUniversityScreen() {
  const navigation = useNavigation<ExploreUniversityScreenNavigationProp>();

  return (
    <ScrollView background={"white"} minHeight={"full"} paddingY={"4px"}>
      <SafeAreaView edges={["left", "right"]}>
        <Header marginX={"10px"} marginTop={"6px"}>
          Undergraduate Schools
        </Header>

        <Grid margin={5} minChildrenWidth={140} childrenHeight={"90px"}>
          {["Tandon", "Tandon School of Engineering", "UY"].map(
            (school, index) => (
              <Button
                key={index}
                borderRadius={12}
                onPress={() => {
                  navigation.navigate("Explore-School", { schoolCode: "UY" });
                }}
              >
                {school}
              </Button>
            )
          )}
        </Grid>

        <Header marginX={"10px"} marginTop={"16px"}>
          Graduate Schools
        </Header>

        <Grid margin={5} minChildrenWidth={140} childrenHeight={"90px"}>
          {["Tandon", "Tandon School of Engineering", "GY"].map(
            (school, index) => (
              <Button
                key={index}
                borderRadius={12}
                onPress={() => {
                  navigation.navigate("Explore-School", { schoolCode: "GY" });
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
