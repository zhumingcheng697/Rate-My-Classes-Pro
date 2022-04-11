import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  ClassInfo,
  StarredClassInfo,
  Settings,
} from "../libs/types";
import Semester from "../libs/semester";

export enum ActionType {
  setSchoolNameRecord = "SET_SCHOOL_NAME_RECORD_ACTION",
  setDepartmentNameRecord = "SET_DEPARTMENT_NAME_RECORD_ACTION",
  loadSettings = "LOAD_SETTINGS",
  selectSemester = "SELECT_SEMESTER_ACTION",
  setShowPreviousSemesters = "SET_SHOW_PREVIOUS_SEMESTERS_ACTION",
  starClass = "STAR_CLASS_ACTION",
  unstarClass = "UNSTAR_CLASS_ACTION",
}

export type SchoolNameAction = {
  type: ActionType.setSchoolNameRecord;
  payload?: SchoolNameRecord;
};

export type DepartmentNameAction = {
  type: ActionType.setDepartmentNameRecord;
  payload?: DepartmentNameRecord;
};

export type SettingsAction =
  | { type: ActionType.loadSettings; payload?: Settings }
  | { type: ActionType.selectSemester; payload?: Semester }
  | { type: ActionType.setShowPreviousSemesters; payload?: boolean };

export type StarClassAction =
  | { type: ActionType.starClass; payload?: StarredClassInfo }
  | { type: ActionType.unstarClass; payload?: ClassInfo };
