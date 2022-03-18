export type SchoolNameRecord = Record<string, string>;

export type DepartmentNameRecord = Record<string, string>;

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
