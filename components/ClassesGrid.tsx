import React from "react";
import { type StackNavigationProp } from "@react-navigation/stack";

import type {
  SharedNavigationParamList,
  ClassInfo,
  StarredOrReviewed,
} from "../libs/types";
import Grid, { type GridProps } from "../containers/Grid";
import TieredTextButton from "./TieredTextButton";
import { getFullClassCode } from "../libs/utils";

type ClassesGridNavigationProp = StackNavigationProp<SharedNavigationParamList>;

type ClassesGridBaseProps = {
  classes: ClassInfo[];
  navigation: ClassesGridNavigationProp;
  query?: string;
  starredOrReviewed?: StarredOrReviewed;
};

export type ClassesGridProps = ClassesGridBaseProps &
  Omit<GridProps, keyof ClassesGridBaseProps | "children" | "childrenCount">;

export default function ClassesGrid({
  classes,
  navigation,
  query,
  starredOrReviewed,
  ...rest
}: ClassesGridProps) {
  return (
    <Grid childrenCount={classes.length} {...rest}>
      {(info) =>
        classes.map((classInfo) => {
          return (
            <TieredTextButton
              key={`${getFullClassCode(classInfo)} ${classInfo.name}`}
              {...info}
              primaryText={classInfo.name}
              secondaryText={getFullClassCode(classInfo)}
              onPress={() => {
                navigation.navigate("Detail", {
                  classInfo,
                  query,
                  starredOrReviewed,
                });
              }}
            />
          );
        })
      }
    </Grid>
  );
}
