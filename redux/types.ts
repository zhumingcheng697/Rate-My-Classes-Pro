import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  StarredClassRecord,
  StarredClassInfo,
  ReviewedClassRecord,
  ReviewedClassInfo,
  ClassInfo,
  Settings,
} from "../libs/types";
import type Semester from "../libs/semester";

export enum ActionType {
  setSchoolNameRecord = "SET_SCHOOL_NAME_RECORD_ACTION",
  setDepartmentNameRecord = "SET_DEPARTMENT_NAME_RECORD_ACTION",
  loadSettings = "LOAD_SETTINGS_ACTION",
  selectSemester = "SELECT_SEMESTER_ACTION",
  setShowPreviousSemesters = "SET_SHOW_PREVIOUS_SEMESTERS_ACTION",
  loadStarredClasses = "LOAD_STARRED_CLASSES_ACTION",
  starClass = "STAR_CLASS_ACTION",
  unstarClass = "UNSTAR_CLASS_ACTION",
  loadReviewedClasses = "LOAD_REVIEWED_CLASSES_ACTION",
  reviewClass = "REVIEW_CLASS_ACTION",
  unreviewClass = "UNREVIEW_CLASS_ACTION",
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
  | { type: ActionType.loadStarredClasses; payload?: StarredClassRecord }
  | { type: ActionType.starClass; payload?: StarredClassInfo }
  | { type: ActionType.unstarClass; payload?: ClassInfo };

export type ReviewClassAction =
  | { type: ActionType.loadReviewedClasses; payload?: ReviewedClassRecord }
  | { type: ActionType.reviewClass; payload?: ReviewedClassInfo }
  | { type: ActionType.unreviewClass; payload?: ClassInfo };
