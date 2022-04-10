import { type Dispatch } from "redux";
import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  ClassInfo,
} from "../libs/types";
import {
  type SchoolNameAction,
  type DepartmentNameAction,
  type SettingsAction,
  type StarClassAction,
  ActionType,
} from "./types";
import Semester from "../libs/semester";

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

export const starClass =
  (dispath: Dispatch<StarClassAction>) => (classInfo: ClassInfo) => {
    dispath({
      type: ActionType.starClass,
      payload: { ...classInfo, starredDate: Date.now() },
    });
  };

export const unstarClass =
  (dispath: Dispatch<StarClassAction>) => (classInfo: ClassInfo) => {
    dispath({
      type: ActionType.unstarClass,
      payload: classInfo,
    });
  };
