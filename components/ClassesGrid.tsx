import React, { useMemo } from "react";
import { type StackNavigationProp } from "@react-navigation/stack";

import type {
  SharedNavigationParamList,
  ClassInfo,
  StarredOrReviewed,
} from "../libs/types";
import { getFullClassCode, Route } from "../libs/utils";
import { useInitialTabName } from "../libs/hooks";
import Grid, { type GridProps } from "../containers/Grid";
import { TieredTextButton } from "./LinkCompatibleButton";
import type { SemesterInfo } from "../libs/semester";

type ClassesGridNavigationProp = StackNavigationProp<SharedNavigationParamList>;

type ClassesGridBaseProps = {
  classes: ClassInfo[];
  navigation: ClassesGridNavigationProp;
  query?: string;
  starredOrReviewed?: StarredOrReviewed;
  semesterInfo: SemesterInfo;
};

export type ClassesGridProps = ClassesGridBaseProps &
  Omit<GridProps, keyof ClassesGridBaseProps | "children" | "childrenCount">;

export default function ClassesGrid({
  classes,
  navigation,
  query,
  starredOrReviewed,
  semesterInfo,
  ...rest
}: ClassesGridProps) {
  const tabName = useInitialTabName();
  const duplicateIndices = useMemo(() => {
    const classKeys = new Set<string>();
    const duplicateIndices = new Set<number>();

    classes.forEach((classInfo, i) => {
      const classKey = `${getFullClassCode(classInfo)} ${classInfo.name}`;
      if (classKeys.has(classKey)) {
        duplicateIndices.add(i);
      } else {
        classKeys.add(classKey);
      }
    });

    return duplicateIndices;
  }, [classes]);

  return (
    <Grid childrenCount={classes.length - duplicateIndices.size} {...rest}>
      {(info) =>
        classes.map((classInfo, index) =>
          duplicateIndices.has(index) ? null : (
            <TieredTextButton
              key={`${getFullClassCode(classInfo)} ${classInfo.name}`}
              {...info}
              primaryText={classInfo.name}
              secondaryText={getFullClassCode(classInfo)}
              linkTo={Route(tabName, "Detail", {
                classCode: classInfo,
                query,
                starredOrReviewed,
                semester: semesterInfo,
              })}
            />
          )
        )
      }
    </Grid>
  );
}
