import { createStackNavigator } from "@react-navigation/stack";

import MeAccountScreen from "../screens/me/MeAccountScreen";
import MeStarredReviewedScreen from "../screens/me/MeStarredReviewedScreen";
import MeSignUpScreen from "../screens/me/MeSignUpScreen";
import MeSignInScreen from "../screens/me/MeSignInScreen";
import DetailScreen from "../screens/detail/DetailScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { getClassCode } from "../shared/utils";
import { type MeNavigationParamList } from "../shared/types";

const Stack = createStackNavigator<MeNavigationParamList>();

export default function MeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Account"}
        component={MeAccountScreen}
        options={{ title: "Me" }}
      />
      <Stack.Screen name={"Starred"} component={MeStarredReviewedScreen} />
      <Stack.Screen name={"Reviewed"} component={MeStarredReviewedScreen} />
      <Stack.Screen name={"Settings"} component={PlaceHolderScreen} />
      <Stack.Screen
        name={"SignIn"}
        component={MeSignInScreen}
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name={"SignUp"}
        component={MeSignUpScreen}
        options={{
          title: "Sign Up",
        }}
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
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
