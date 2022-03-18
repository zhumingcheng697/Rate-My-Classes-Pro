import { type Dispatch } from "redux";
import { SchoolNameRecord, DepartmentNameRecord } from "../shared/types";
import { SchoolNameAction, DepartmentNameAction } from "./types";

export const updateSchoolNameRecord =
  (dispath: Dispatch<SchoolNameAction>) =>
  (schoolNameRecord: SchoolNameRecord) => {
    dispath({ type: "update-school-name-record", payload: schoolNameRecord });
  };

export const updateDepartmentNameRecord =
  (dispath: Dispatch<DepartmentNameAction>) =>
  (departmentNameRecord: DepartmentNameRecord) => {
    dispath({
      type: "update-department-name-record",
      payload: departmentNameRecord,
    });
  };
