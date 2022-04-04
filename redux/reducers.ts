import { combineReducers } from "redux";
import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  StarredClassRecord,
} from "../shared/types";
import { getFullClassCode } from "../shared/utils";
import {
  type SchoolNameAction,
  type DepartmentNameAction,
  type StarClassAction,
  ActionType,
} from "./types";

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

function starredClassReducer(
  state: StarredClassRecord = {},
  action: StarClassAction
) {
  if (!!action.payload) {
    if (action.type === ActionType.starClass) {
      const newState = { ...state };
      newState[getFullClassCode(action.payload)] = true;
      return newState;
    } else if (action.type === ActionType.unstarClass) {
      const newState = { ...state };
      delete newState[getFullClassCode(action.payload)];
      return newState;
    }
  }

  return state;
}

export default combineReducers({
  schoolNameRecord: schoolNameReducer,
  departmentNameRecord: departmentNameReducer,
  starredClassRecord: starredClassReducer,
});
