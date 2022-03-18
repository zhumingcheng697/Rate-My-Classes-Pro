import { Text, Button } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import { type ExploreNavigationParamList } from "../../shared/types";
import SafeAreaScrollView from "../../containers/SafeAreaScrollView";
import Grid from "../../containers/Grid";
import {
  getSchoolNameByInfo,
  getDepartmentNameByInfo,
} from "../../shared/utils";
import TieredTextButton from "../../components/TieredTextButton";

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
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>
        {getDepartmentNameByInfo(route.params, departmentNames)}
      </Text>
      <Text variant={"h2"}>
        {getSchoolNameByInfo(route.params, schoolNames)}
      </Text>
      <Grid minChildrenWidth={140} childrenHeight={"90px"}>
        {["2193", "3193", "4193"].map((classNumber, index) => (
          <TieredTextButton
            key={index}
            primaryText={"Lorem ipsum dolor sit amet"}
            secondaryText={classNumber}
            onPress={() => {
              navigation.navigate("Explore-Detail", {
                ...route.params,
                classNumber,
                name: classNumber,
                description:
                  "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas modi explicabo fuga, eum libero ipsum magnam. Dolores, vel vero nobis doloribus voluptatibus soluta ratione adipisci repellat voluptatem libero ipsam rerum.",
              });
            }}
          />
        ))}
      </Grid>
    </SafeAreaScrollView>
  );
}
