import React from "react";
import { type StackNavigationProp } from "@react-navigation/stack";

import type { SharedNavigationParamList, ClassInfo } from "../libs/types";
import Grid, { GridProps } from "../containers/Grid";
import TieredTextButton from "./TieredTextButton";
import { getFullClassCode } from "../libs/utils";

type ClassesGridNavigationProp = StackNavigationProp<SharedNavigationParamList>;

type ClassesGridBaseProps = {
  classes: ClassInfo[];
  navigation: ClassesGridNavigationProp;
};

export type ClassesGridProps = ClassesGridBaseProps &
  Omit<GridProps, keyof ClassesGridBaseProps | "children">;

export default function ClassesGrid({
  classes,
  navigation,
  ...rest
}: ClassesGridProps) {
  return (
    <Grid {...rest}>
      {(info) =>
        classes.map((classInfo) => {
          return (
            <TieredTextButton
              key={`${getFullClassCode(classInfo)} ${classInfo.name}`}
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
