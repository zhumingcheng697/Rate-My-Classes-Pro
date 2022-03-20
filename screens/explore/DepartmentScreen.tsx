import { Text } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type { ExploreNavigationParamList, ClassCode } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import {
  getSchoolName,
  getDepartmentName,
  getClassCode,
  placeholderClassNumbers,
} from "../../shared/utils";
import TieredTextButton from "../../components/TieredTextButton";

type DepartmentScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Department"
>;

type DepartmentScreenRouteProp = RouteProp<
  ExploreNavigationParamList,
  "Department"
>;

export default function DepartmentScreen() {
  const navigation = useNavigation<DepartmentScreenNavigationProp>();
  const route = useRoute<DepartmentScreenRouteProp>();
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Text variant={"h1"}>
        {getDepartmentName(route.params, departmentNames)}
      </Text>
      <Text variant={"h2"}>{getSchoolName(route.params, schoolNames)}</Text>
      <Grid>
        {(info) =>
          placeholderClassNumbers.map((classNumber, index) => {
            const classCode: ClassCode = { ...route.params, classNumber };

            return (
              <TieredTextButton
                key={index}
                {...info}
                primaryText={"Lorem ipsum dolor sit amet"}
                secondaryText={getClassCode(classCode)}
                onPress={() => {
                  navigation.navigate("Detail", {
                    ...classCode,
                    name: classNumber,
                    description:
                      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas modi explicabo fuga, eum libero ipsum magnam. Dolores, vel vero nobis doloribus voluptatibus soluta ratione adipisci repellat voluptatem libero ipsam rerum.",
                  });
                }}
              />
            );
          })
        }
      </Grid>
    </KeyboardAwareSafeAreaScrollView>
  );
}
