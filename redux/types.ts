import { SchoolNameRecord, DepartmentNameRecord } from "../shared/types";

export enum ActionType {
  setSchoolNameRecord = "SET_SCHOOL_NAME_RECORD",
  setDepartmentNameRecord = "SET_DEPARTMENT_NAME_RECORD",
}

export type SchoolNameAction = {
  type: ActionType.setSchoolNameRecord;
  payload?: SchoolNameRecord;
};

export type DepartmentNameAction = {
  type: ActionType.setDepartmentNameRecord;
  payload?: DepartmentNameRecord;
};

export type RootState = {
  schoolNameRecord: SchoolNameRecord;
  departmentNameRecord: DepartmentNameRecord;
};
