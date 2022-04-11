import { type Dispatch } from "redux";
import { type User } from "realm";

import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  Settings,
  ClassInfo,
  StarredClassInfo,
} from "../libs/types";
import {
  type SchoolNameAction,
  type DepartmentNameAction,
  type SettingsAction,
  type StarClassAction,
  ActionType,
} from "./types";
import Semester from "../libs/semester";
import { useDB } from "../mongodb/db";

export const setSchoolNameRecord =
  (dispath: Dispatch<SchoolNameAction>) =>
  (schoolNameRecord: SchoolNameRecord) => {
    dispath({
      type: ActionType.setSchoolNameRecord,
      payload: schoolNameRecord,
    });
  };

export const setDepartmentNameRecord =
  (dispath: Dispatch<DepartmentNameAction>) =>
  (departmentNameRecord: DepartmentNameRecord) => {
    dispath({
      type: ActionType.setDepartmentNameRecord,
      payload: departmentNameRecord,
    });
  };

export const loadSettings =
  (dispath: Dispatch<SettingsAction>) => (settings: Settings) => {
    dispath({
      type: ActionType.loadSettings,
      payload: settings,
    });
  };

export const selectSemester =
  (dispath: Dispatch<SettingsAction>) => (semester: Semester) => {
    dispath({
      type: ActionType.selectSemester,
      payload: semester,
    });
  };

export const setShowPreviousSemesters =
  (dispath: Dispatch<SettingsAction>) => (showPreviousSemesters: boolean) => {
    dispath({
      type: ActionType.setShowPreviousSemesters,
      payload: showPreviousSemesters,
    });
  };

export const loadStarredClasses =
  (dispath: Dispatch<StarClassAction>) =>
  (starredClasses: StarredClassInfo[]) => {
    dispath({
      type: ActionType.loadStarredClasses,
      payload: starredClasses,
    });
  };

export const starClass = (dispath: Dispatch<StarClassAction>, user: User) => {
  const db = useDB(user);

  return async (classInfo: ClassInfo) => {
    const starredClass = { ...classInfo, starredDate: Date.now() };

    dispath({
      type: ActionType.starClass,
      payload: starredClass,
    });

    await db.starClass(starredClass);
  };
};

export const unstarClass = (dispath: Dispatch<StarClassAction>, user: User) => {
  const db = useDB(user);

  return async (classInfo: ClassInfo) => {
    dispath({
      type: ActionType.unstarClass,
      payload: classInfo,
    });

    await db.unstarClass(classInfo);
  };
};
