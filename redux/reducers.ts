import { combineReducers } from "redux";
import { SchoolNameRecord, DepartmentNameRecord } from "../shared/types";
import { SchoolNameAction, DepartmentNameAction, ActionType } from "./types";

function schoolNameReducer(
  state: SchoolNameRecord = {},
  action: SchoolNameAction
) {
  if (action.type === ActionType.setSchoolNameRecord && !!action.payload) {
    return action.payload;
  }

  return state;
}

function departmentNameReducer(
  state: DepartmentNameRecord = {},
  action: DepartmentNameAction
) {
  if (action.type === ActionType.setDepartmentNameRecord && !!action.payload) {
    return action.payload;
  }

  return state;
}

export default combineReducers({
  schoolNameRecord: schoolNameReducer,
  departmentNameRecord: departmentNameReducer,
});
