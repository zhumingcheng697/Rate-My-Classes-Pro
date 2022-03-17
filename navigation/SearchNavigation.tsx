import { createStackNavigator } from "@react-navigation/stack";

import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { type SearchNavigationParamList } from "../types";

const Stack = createStackNavigator<SearchNavigationParamList>();

export default function SearchNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Search-University"}
        component={PlaceHolderScreen}
        options={{ title: "Search" }}
      />
      <Stack.Screen
        name={"Search-Detail"}
        component={PlaceHolderScreen}
        options={({ route }) => ({
          title: `${route.params.department.toUpperCase()}-${route.params.school.toUpperCase()} ${route.params.code.toUpperCase()}`,
        })}
      />
    </Stack.Navigator>
  );
}
