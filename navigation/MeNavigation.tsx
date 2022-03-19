import { createStackNavigator } from "@react-navigation/stack";

import MeAccountScreen from "../screens/me/MeAccountScreen";
import MeStarredReviewedScreen from "../screens/me/MeStarredReviewedScreen";
import DetailScreen from "../screens/detail/DetailScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { getClassCode } from "../shared/utils";
import { type MeNavigationParamList } from "../shared/types";

const Stack = createStackNavigator<MeNavigationParamList>();

export default function MeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Me-Account"}
        component={MeAccountScreen}
        options={{ title: "Me" }}
      />
      <Stack.Screen
        name={"Me-Starred"}
        component={MeStarredReviewedScreen}
        options={{
          title: "Starred",
        }}
      />
      <Stack.Screen
        name={"Me-Reviewed"}
        component={MeStarredReviewedScreen}
        options={{
          title: "Reviewd",
        }}
      />
      <Stack.Screen
        name={"Me-SignIn"}
        component={PlaceHolderScreen}
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name={"Me-SignUp"}
        component={PlaceHolderScreen}
        options={{
          title: "Sign Up",
        }}
      />
      <Stack.Screen
        name={"Me-Detail"}
        component={DetailScreen}
        options={({ route }) => ({
          title: getClassCode(route.params),
        })}
      />
    </Stack.Navigator>
  );
}
