import { combineReducers } from "redux";
import { SchoolNameRecord, DepartmentNameRecord } from "../shared/types";
import { SchoolNameAction, DepartmentNameAction } from "./types";

function schoolNameReducer(
  state: SchoolNameRecord = {},
  action: SchoolNameAction
) {
  if (action.type === "update-school-name-record" && !!action.payload) {
    return action.payload;
  }

  return state;
}

function departmentNameReducer(
  state: DepartmentNameRecord = {},
  action: DepartmentNameAction
) {
  if (action.type === "update-department-name-record" && !!action.payload) {
    return action.payload;
  }

  return state;
}

export default combineReducers({
  schoolNameRecord: schoolNameReducer,
  departmentNameRecord: departmentNameReducer,
});
