import { type Dispatch } from "redux";
import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  ClassCode,
} from "../shared/types";
import {
  type SchoolNameAction,
  type DepartmentNameAction,
  type StarClassAction,
  ActionType,
} from "./types";

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

export const starClass =
  (dispath: Dispatch<StarClassAction>) => (classCode: ClassCode) => {
    dispath({
      type: ActionType.starClass,
      payload: classCode,
    });
  };

export const unstarClass =
  (dispath: Dispatch<StarClassAction>) => (classCode: ClassCode) => {
    dispath({
      type: ActionType.unstarClass,
      payload: classCode,
    });
  };
