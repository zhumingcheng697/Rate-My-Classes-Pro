import { createStackNavigator } from "@react-navigation/stack";

import UniversityScreen from "../screens/explore/UniversityScreen";
import SchoolScreen from "../screens/explore/SchoolScreen";
import DepartmentScreen from "../screens/explore/DepartmentScreen";
import DetailScreen from "../screens/detail/DetailScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import reviewScreenOptions from "./reviewScreenOptions";
import { getClassCode } from "../shared/utils";
import { type ExploreNavigationParamList } from "../shared/types";

const Stack = createStackNavigator<ExploreNavigationParamList>();

export default function ExploreNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"University"}
        component={UniversityScreen}
        options={{ title: "Explore" }}
      />
      <Stack.Screen
        name={"School"}
        component={SchoolScreen}
        options={({ route }) => ({
          title: route.params.schoolCode.toUpperCase(),
        })}
      />
      <Stack.Screen
        name={"Department"}
        component={DepartmentScreen}
        options={({ route }) => ({
          title: `${route.params.departmentCode.toUpperCase()}-${route.params.schoolCode.toUpperCase()}`,
        })}
      />
      <Stack.Screen
        name={"Detail"}
        component={DetailScreen}
        options={({ route }) => ({
          title: getClassCode(route.params),
        })}
      />
      <Stack.Screen
        name={"Review"}
        component={PlaceHolderScreen}
        options={reviewScreenOptions}
      />
    </Stack.Navigator>
  );
}
