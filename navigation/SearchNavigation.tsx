import { createStackNavigator } from "@react-navigation/stack";

import SearchClassScreen from "../screens/search/SearchClassScreen";
import DetailScreen from "../screens/detail/DetailScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { getClassCode } from "../shared/utils";
import { type SearchNavigationParamList } from "../shared/types";

const Stack = createStackNavigator<SearchNavigationParamList>();

export default function SearchNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={"Search"} component={SearchClassScreen} />
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
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
