import React, { useCallback, useMemo } from "react";

import type { ClassInfo, StarredOrReviewed } from "../libs/types";
import { getFullClassCode, Route } from "../libs/utils";
import { useInitialTabName } from "../libs/hooks";
import Grid, { type GridProps } from "../containers/Grid";
import { TieredTextButton } from "./LinkCompatibleButton";
import type { SemesterInfo } from "../libs/semester";

type ClassesGridBaseProps = {
  classes: ClassInfo[];
  query?: string;
  starredOrReviewed?: StarredOrReviewed;
  semesterInfo: SemesterInfo;
};

export type ClassesGridProps = ClassesGridBaseProps &
  Omit<GridProps, keyof ClassesGridBaseProps | "children" | "childrenCount">;

export default function ClassesGrid({
  classes,
  query,
  starredOrReviewed,
  semesterInfo,
  ...rest
}: ClassesGridProps) {
  const tabName = useInitialTabName();
  const duplicateIndices = useMemo(() => {
    const classKeys = new Set<string>();
    const duplicateIndices = new Set<number>();

    const findDuplicate = (classInfo: ClassInfo, i: number) => {
      const classKey = `${getFullClassCode(classInfo)} ${classInfo.name}`;
      if (classKeys.has(classKey)) {
        duplicateIndices.add(i);
      } else {
        classKeys.add(classKey);
      }
    };

    classes.forEach(findDuplicate);

    return duplicateIndices;
  }, [classes]);

  const classToNavigationButton = useCallback(
    (info) => (classInfo: ClassInfo, index: number) =>
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
      ),
    [duplicateIndices, tabName, query, starredOrReviewed, semesterInfo]
  );

  const classesToNavigationButtons = useCallback(
    (info) => {
      const btn = classToNavigationButton(info);
      return classes.map(btn);
    },
    [classes, classToNavigationButton]
  );

  return (
    <Grid childrenCount={classes.length - duplicateIndices.size} {...rest}>
      {classesToNavigationButtons}
    </Grid>
  );
}
