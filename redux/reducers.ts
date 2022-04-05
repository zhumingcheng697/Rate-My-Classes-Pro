import { combineReducers } from "redux";
import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  StarredClassRecord,
  Settings,
} from "../shared/types";
import {
  type SchoolNameAction,
  type DepartmentNameAction,
  type SemesterAction,
  type SettingsAction,
  type StarClassAction,
  ActionType,
} from "./types";
import { getFullClassCode } from "../shared/utils";
import Semester from "../shared/semester";

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

function settingsReducer(
  state: Settings = {
    selectedSemester: Semester.predictCurrentSemester(),
    showPreviousSemesters: false,
  },
  action: SettingsAction
) {
  if (action.type === ActionType.selectSemester) {
    if (action.payload) {
      state.selectedSemester = action.payload;
    }
  } else if (action.type === ActionType.setShowPreviousSemesters) {
    if (typeof action.payload !== "undefined") {
      state.showPreviousSemesters = action.payload;
    }
  }

  if (
    !Semester.getSemesterOptions(state.showPreviousSemesters).find((semester) =>
      Semester.equals(semester, state.selectedSemester)
    )
  ) {
    state.selectedSemester = Semester.predictCurrentSemester();
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
      newState[getFullClassCode(action.payload)] = { ...action.payload };
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
  settings: settingsReducer,
  starredClassRecord: starredClassReducer,
});
