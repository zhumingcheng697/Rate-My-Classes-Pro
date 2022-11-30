import { type Dispatch } from "redux";

import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  StarredClassRecord,
  ReviewedClassRecord,
  ClassCode,
  ReviewedClassInfo,
  StarredClassInfo,
  Settings,
} from "../libs/types";
import {
  type SchoolNameAction,
  type DepartmentNameAction,
  type StarClassAction,
  type ReviewClassAction,
  type SettingsAction,
  ActionType,
} from "./types";
import type { SemesterInfo } from "../libs/semester";

namespace Action {
  export const setSchoolNameRecord =
    (dispath: Dispatch<SchoolNameAction>) =>
    (schoolNameRecord: SchoolNameRecord) =>
      dispath({
        type: ActionType.setSchoolNameRecord,
        payload: schoolNameRecord,
      });

  export const setDepartmentNameRecord =
    (dispath: Dispatch<DepartmentNameAction>) =>
    (departmentNameRecord: DepartmentNameRecord | null) =>
      dispath({
        type: ActionType.setDepartmentNameRecord,
        payload: departmentNameRecord,
      });

  export const loadSettings =
    (dispath: Dispatch<SettingsAction>) => (settings: Settings) =>
      dispath({
        type: ActionType.loadSettings,
        payload: settings,
      });

  export const selectSemester =
    (dispath: Dispatch<SettingsAction>) => (semester: SemesterInfo) =>
      dispath({
        type: ActionType.selectSemester,
        payload: semester,
      });

  export const loadStarredClasses =
    (dispath: Dispatch<StarClassAction>) =>
    (starredClasses: StarredClassRecord) =>
      dispath({
        type: ActionType.loadStarredClasses,
        payload: starredClasses,
      });

  export const starClass =
    (dispath: Dispatch<StarClassAction>) =>
    async (starredClass: StarredClassInfo) =>
      dispath({
        type: ActionType.starClass,
        payload: starredClass,
      });

  export const unstarClass =
    (dispath: Dispatch<StarClassAction>) => (classCode: ClassCode) =>
      dispath({
        type: ActionType.unstarClass,
        payload: classCode,
      });

  export const loadReviewedClasses =
    (dispath: Dispatch<ReviewClassAction>) =>
    (reviewedClasses: ReviewedClassRecord) =>
      dispath({
        type: ActionType.loadReviewedClasses,
        payload: reviewedClasses,
      });

  export const reviewClass =
    (dispath: Dispatch<ReviewClassAction>) =>
    (reviewedClass: ReviewedClassInfo) =>
      dispath({
        type: ActionType.reviewClass,
        payload: reviewedClass,
      });

  export const unreviewClass =
    (dispath: Dispatch<ReviewClassAction>) => (classCode: ClassCode) =>
      dispath({
        type: ActionType.unreviewClass,
        payload: classCode,
      });
}

export default Action;
