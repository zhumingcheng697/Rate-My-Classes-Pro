import { SchoolNameRecord, DepartmentNameRecord } from "../shared/types";

export type SchoolNameAction = {
  type: ReduxActionType;
  payload?: SchoolNameRecord;
};

export type DepartmentNameAction = {
  type: ReduxActionType;
  payload?: DepartmentNameRecord;
};

type ReduxActionType =
  | "update-school-name-record"
  | "update-department-name-record";

export type RootState = {
  schoolNameRecord: SchoolNameRecord;
  departmentNameRecord: DepartmentNameRecord;
};
