import { createStackNavigator } from "@react-navigation/stack";

import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { type ExploreNavigationParamList } from "../types";

const Stack = createStackNavigator<ExploreNavigationParamList>();

export default function ExploreNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Explore-University"}
        component={PlaceHolderScreen}
        options={{ title: "Explore" }}
      />
      <Stack.Screen
        name={"Explore-School"}
        component={PlaceHolderScreen}
        options={({ route }) => ({
          title: route.params.school.toUpperCase(),
        })}
      />
      <Stack.Screen
        name={"Explore-Department"}
        component={PlaceHolderScreen}
        options={({ route }) => ({
          title: `${route.params.department.toUpperCase()}-${route.params.school.toUpperCase()}`,
        })}
      />
      <Stack.Screen
        name={"Explore-Detail"}
        component={PlaceHolderScreen}
        options={({ route }) => ({
          title: `${route.params.department.toUpperCase()}-${route.params.school.toUpperCase()} ${route.params.code.toUpperCase()}`,
        })}
      />
    </Stack.Navigator>
  );
}
