import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { type RootNavigationParamList } from "../types";
import ExploreNavigation from "./ExploreNavigation";
import SearchNavigation from "./SearchNavigation";
import MeNavigation from "./MeNavigation";

const Tab = createBottomTabNavigator<RootNavigationParamList>();

export default function RootNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        title: route.name.replace(/-Tab/gi, ""),
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "Explore-Tab") {
            iconName = "compass";
          } else if (route.name === "Search-Tab") {
            iconName = "search";
          } else {
            iconName = "person";
          }

          return (
            <Ionicons
              name={focused ? iconName : `${iconName}-outline`}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name={"Explore-Tab"} component={ExploreNavigation} />
      <Tab.Screen name={"Search-Tab"} component={SearchNavigation} />
      <Tab.Screen name={"Me-Tab"} component={MeNavigation} />
    </Tab.Navigator>
  );
}
