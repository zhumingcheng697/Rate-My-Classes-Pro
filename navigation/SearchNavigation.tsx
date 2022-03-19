import { createStackNavigator } from "@react-navigation/stack";

import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { getClassCode } from "../shared/utils";
import { type SearchNavigationParamList } from "../shared/types";
import DetailScreen from "../screens/detail/DetailScreen";

const Stack = createStackNavigator<SearchNavigationParamList>();

export default function SearchNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Search-Class"}
        component={PlaceHolderScreen}
        options={{ title: "Search" }}
      />
      <Stack.Screen
        name={"Search-Detail"}
        component={DetailScreen}
        options={({ route }) => ({
          title: getClassCode(route.params),
        })}
      />
    </Stack.Navigator>
  );
}
