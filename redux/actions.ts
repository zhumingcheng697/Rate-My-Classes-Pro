import { type Dispatch } from "redux";
import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  ClassInfo,
} from "../shared/types";
import {
  type SchoolNameAction,
  type DepartmentNameAction,
  type StarClassAction,
  ActionType,
  SemesterAction,
} from "./types";
import Semester from "../shared/semester";

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
  (dispath: Dispatch<SemesterAction>) => (semester: Semester) => {
    dispath({
      type: ActionType.selectSemester,
      payload: semester,
    });
  };

export const starClass =
  (dispath: Dispatch<StarClassAction>) => (classInfo: ClassInfo) => {
    dispath({
      type: ActionType.starClass,
      payload: classInfo,
    });
  };

export const unstarClass =
  (dispath: Dispatch<StarClassAction>) => (classInfo: ClassInfo) => {
    dispath({
      type: ActionType.unstarClass,
      payload: classInfo,
    });
  };
