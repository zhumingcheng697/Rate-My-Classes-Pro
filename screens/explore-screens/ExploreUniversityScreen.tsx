import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, Button, Skeleton } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import { type ExploreNavigationParamList } from "../../shared/types";
import { isSchoolGrad } from "../../shared/helper";
import { RootState } from "../../redux/types";
import Grid from "../../components/Grid";

type ExploreUniversityScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-University"
>;

export default function ExploreUniversityScreen() {
  const navigation = useNavigation<ExploreUniversityScreenNavigationProp>();
  const schoolNames = useSelector((state: RootState) => state.schoolNameRecord);

  const [undergradCodes, gradCodes] = useMemo(() => {
    if (!schoolNames) return [[], []];

    const undergradCodes: string[] = [];
    const gradCodes: string[] = [];

    for (let code in schoolNames) {
      if (isSchoolGrad(code)) {
        gradCodes.push(code);
      } else {
        undergradCodes.push(code);
      }
    }

    return [undergradCodes, gradCodes];
  }, [schoolNames]);

  return (
    <ScrollView>
      <SafeAreaView edges={["left", "right"]}>
        <Text variant={"h1"}>Undergraduate</Text>
        <Grid minChildrenWidth={140} childrenHeight={"90px"}>
          {schoolNames === null
            ? [...Array(17)].map((_, index) => (
                <Skeleton key={index} borderRadius={12} />
              ))
            : undergradCodes.map((code, index) => (
                <Button
                  key={index}
                  borderRadius={12}
                  onPress={() => {
                    navigation.navigate("Explore-School", {
                      schoolCode: code,
                    });
                  }}
                >
                  {schoolNames[code]}
                </Button>
              ))}
        </Grid>

        <Text variant={"h1"} marginTop={"16px"}>
          Graduate
        </Text>
        <Grid minChildrenWidth={140} childrenHeight={"90px"}>
          {schoolNames === null
            ? [...Array(12)].map((_, index) => (
                <Skeleton key={index} borderRadius={12} />
              ))
            : gradCodes.map((code, index) => (
                <Button
                  key={index}
                  borderRadius={12}
                  onPress={() => {
                    navigation.navigate("Explore-School", {
                      schoolCode: code,
                    });
                  }}
                >
                  {schoolNames[code]}
                </Button>
              ))}
        </Grid>
      </SafeAreaView>
    </ScrollView>
  );
}
