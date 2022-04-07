import { type StackNavigationProp } from "@react-navigation/stack";

import {
  type ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
  ClassInfo,
} from "../shared/types";
import Grid, { GridProps } from "../containers/Grid";
import TieredTextButton from "./TieredTextButton";
import { getFullClassCode } from "../shared/utils";

type ClassesGridNavigationProp = StackNavigationProp<
  ExploreNavigationParamList | SearchNavigationParamList | MeNavigationParamList
>;

type ClassesGridBaseProps = {
  classes: ClassInfo[];
  navigation: ClassesGridNavigationProp;
};

export type ClassesGridProps = ClassesGridBaseProps &
  Omit<GridProps, keyof ClassesGridBaseProps>;

export default function ClassesGrid({
  classes,
  navigation,
  ...rest
}: ClassesGridProps) {
  return (
    <Grid {...rest}>
      {(info) =>
        classes.map((classInfo, index) => {
          return (
            <TieredTextButton
              key={index}
              {...info}
              primaryText={classInfo.name}
              secondaryText={getFullClassCode(classInfo)}
              onPress={() => {
                navigation.navigate("Detail", classInfo);
              }}
            />
          );
        })
      }
    </Grid>
  );
}
