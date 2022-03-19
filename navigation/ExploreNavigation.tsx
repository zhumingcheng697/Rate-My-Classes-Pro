import { createStackNavigator } from "@react-navigation/stack";

import ExploreUniversityScreen from "../screens/explore/ExploreUniversityScreen";
import ExploreSchoolScreen from "../screens/explore/ExploreSchoolScreen";
import ExploreDepartmentScreen from "../screens/explore/ExploreDepartmentScreen";
import DetailScreen from "../screens/detail/DetailScreen";
import { getClassCode } from "../shared/utils";
import { type ExploreNavigationParamList } from "../shared/types";

const Stack = createStackNavigator<ExploreNavigationParamList>();

export default function ExploreNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Explore-University"}
        component={ExploreUniversityScreen}
        options={{ title: "Explore" }}
      />
      <Stack.Screen
        name={"Explore-School"}
        component={ExploreSchoolScreen}
        options={({ route }) => ({
          title: route.params.schoolCode.toUpperCase(),
        })}
      />
      <Stack.Screen
        name={"Explore-Department"}
        component={ExploreDepartmentScreen}
        options={({ route }) => ({
          title: `${route.params.departmentCode.toUpperCase()}-${route.params.schoolCode.toUpperCase()}`,
        })}
      />
      <Stack.Screen
        name={"Explore-Detail"}
        component={DetailScreen}
        options={({ route }) => ({
          title: getClassCode(route.params),
        })}
      />
    </Stack.Navigator>
  );
}
