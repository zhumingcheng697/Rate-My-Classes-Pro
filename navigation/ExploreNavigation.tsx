import { Platform } from "react-native";
import { type StackNavigationProp } from "@react-navigation/stack";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import ExploreUniversityScreen from "../screens/explore/ExploreUniversityScreen";
import ExploreSchoolScreen from "../screens/explore/ExploreSchoolScreen";
import ExploreDepartmentScreen from "../screens/explore/ExploreDepartmentScreen";
import DetailScreen from "../screens/detail/DetailScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import { getClassCode } from "../shared/utils";
import { type ExploreNavigationParamList } from "../shared/types";
import PlainTextButton from "../components/PlainTextButton";

const Stack = createStackNavigator<ExploreNavigationParamList>();

type ReviewNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Review"
>;

export default function ExploreNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"University"}
        component={ExploreUniversityScreen}
        options={{ title: "Explore" }}
      />
      <Stack.Screen
        name={"School"}
        component={ExploreSchoolScreen}
        options={({ route }) => ({
          title: route.params.schoolCode.toUpperCase(),
        })}
      />
      <Stack.Screen
        name={"Department"}
        component={ExploreDepartmentScreen}
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
        options={({ navigation }: { navigation: ReviewNavigationProp }) => ({
          presentation: "modal",
          gestureEnabled: false,
          headerLeft: (props) => {
            return (
              <PlainTextButton
                marginLeft={"10px"}
                title={"Cancel"}
                _text={{ fontSize: "md", fontWeight: "normal" }}
                onPress={navigation.goBack}
                {...props}
              />
            );
          },
          headerRight: (props) => {
            return (
              <PlainTextButton
                marginRight={"10px"}
                title={"Save"}
                _text={{ fontSize: "md", fontWeight: "semibold" }}
                onPress={navigation.goBack}
                {...props}
              />
            );
          },
          ...(Platform.OS === "ios" || Platform.OS === "macos"
            ? TransitionPresets.ModalSlideFromBottomIOS
            : TransitionPresets.ScaleFromCenterAndroid),
        })}
      />
    </Stack.Navigator>
  );
}
