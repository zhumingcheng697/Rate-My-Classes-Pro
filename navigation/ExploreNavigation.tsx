import { createStackNavigator } from "@react-navigation/stack";

import ExploreUniversityScreen from "../screens/ExploreUniversityScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { getClassCode } from "../shared/helper";
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
        component={PlaceHolderScreen}
        options={({ route }) => ({
          title: route.params.schoolCode.toUpperCase(),
        })}
      />
      <Stack.Screen
        name={"Explore-Department"}
        component={PlaceHolderScreen}
        options={({ route }) => ({
          title: `${route.params.departmentCode.toUpperCase()}-${route.params.schoolCode.toUpperCase()}`,
        })}
      />
      <Stack.Screen
        name={"Explore-Detail"}
        component={PlaceHolderScreen}
        options={({ route }) => ({
          title: getClassCode(route.params),
        })}
      />
    </Stack.Navigator>
  );
}
