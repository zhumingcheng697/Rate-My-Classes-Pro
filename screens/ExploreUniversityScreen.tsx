import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type ExploreNavigationParamList } from "../shared/types";
import Grid from "../components/Grid";

type ExploreUniversityScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-University"
>;

export default function ExploreUniversityScreen() {
  const navigation = useNavigation<ExploreUniversityScreenNavigationProp>();

  return (
    <ScrollView background={"white"} minHeight={"full"} paddingY={"4px"}>
      <SafeAreaView edges={["left", "right"]}>
        <Text fontWeight={"bold"} fontSize={"3xl"} marginX={"10px"}>
          Undergraduate Schools
        </Text>

        <Grid margin={5} minChildrenWidth={140} childrenHeight={"90px"}>
          {[
            "Tandon",
            "Tandon School of Engineering",
            "UY",
            "Tandon",
            "Tandon School of Engineering",
            "UY",
            "Tandon",
            "Tandon School of Engineering",
            "UY",
            "Tandon",
            "Tandon School of Engineering",
          ].map((school, index) => (
            <Button
              onPress={() => {
                navigation.navigate("Explore-School", { schoolCode: "UY" });
              }}
              key={index}
            >
              {school}
            </Button>
          ))}
        </Grid>

        <Text
          fontWeight={"bold"}
          fontSize={"3xl"}
          marginX={"10px"}
          marginTop={"16px"}
        >
          Graduate Schools
        </Text>

        <Grid margin={5} minChildrenWidth={140} childrenHeight={"90px"}>
          {[
            "Tandon",
            "Tandon School of Engineering",
            "GY",
            "Tandon",
            "Tandon School of Engineering",
            "GY",
            "Tandon",
            "Tandon School of Engineering",
            "GY",
            "Tandon",
            "Tandon School of Engineering",
          ].map((school, index) => (
            <Button
              onPress={() => {
                navigation.navigate("Explore-School", { schoolCode: "GY" });
              }}
              key={index}
            >
              {school}
            </Button>
          ))}
        </Grid>
      </SafeAreaView>
    </ScrollView>
  );
}
