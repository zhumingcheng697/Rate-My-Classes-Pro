import React from "react";
import { type StackNavigationProp } from "@react-navigation/stack";

import type {
  SharedNavigationParamList,
  ClassInfo,
  StarredOrReviewed,
} from "../libs/types";
import { getFullClassCode, Route } from "../libs/utils";
import { useInitialTabName } from "../libs/hooks";
import Grid, { type GridProps } from "../containers/Grid";
import TieredTextButton from "./TieredTextButton";

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
  const tabName = useInitialTabName();

  return (
    <Grid childrenCount={classes.length} {...rest}>
      {(info) =>
        classes.map((classInfo) => (
          <TieredTextButton
            key={`${getFullClassCode(classInfo)} ${classInfo.name}`}
            {...info}
            primaryText={classInfo.name}
            secondaryText={getFullClassCode(classInfo)}
            linkTo={Route(tabName, "Detail", {
              classCode: classInfo,
              query,
              starredOrReviewed,
            })}
          />
        ))
      }
    </Grid>
  );
}
