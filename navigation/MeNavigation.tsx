import { createStackNavigator } from "@react-navigation/stack";

import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { type MeNavigationParamList } from "../types";

const Stack = createStackNavigator<MeNavigationParamList>();

export default function MeNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Me-Account"}
        component={PlaceHolderScreen}
        options={{ title: "Me" }}
      />
      <Stack.Screen
        name={"Me-Starred"}
        component={PlaceHolderScreen}
        options={{
          title: "Starred",
        }}
      />
      <Stack.Screen
        name={"Me-Reviewed"}
        component={PlaceHolderScreen}
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
    </Stack.Navigator>
  );
}
