import { createStackNavigator } from "@react-navigation/stack";

import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { getClassCode } from "../shared/helper";
import { type SearchNavigationParamList } from "../shared/types";

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
          title: getClassCode(route.params),
        })}
      />
    </Stack.Navigator>
  );
}
