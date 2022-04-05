import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  SemesterInfo,
  ClassInfo,
} from "../shared/types";

export enum ActionType {
  setSchoolNameRecord = "SET_SCHOOL_NAME_RECORD",
  setDepartmentNameRecord = "SET_DEPARTMENT_NAME_RECORD",
  selectSemester = "SELECT_SEMESTER",
  starClass = "STAR_CLASS",
  unstarClass = "UNSTAR_CLASS",
}

export type SchoolNameAction = {
  type: ActionType.setSchoolNameRecord;
  payload?: SchoolNameRecord;
};

export type DepartmentNameAction = {
  type: ActionType.setDepartmentNameRecord;
  payload?: DepartmentNameRecord;
};

export type SemesterAction = {
  type: ActionType.selectSemester;
  payload?: SemesterInfo;
};

export type StarClassAction = {
  type: ActionType.starClass | ActionType.unstarClass;
  payload?: ClassInfo;
};
