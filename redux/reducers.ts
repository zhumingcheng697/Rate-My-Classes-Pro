import { combineReducers } from "redux";
import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  StarredClassRecord,
  Settings,
} from "../libs/types";
import {
  type SchoolNameAction,
  type DepartmentNameAction,
  type SettingsAction,
  type StarClassAction,
  ActionType,
} from "./types";
import { getFullClassCode } from "../libs/utils";
import Semester from "../libs/semester";

function schoolNameReducer(
  state: SchoolNameRecord | null = null,
  action: SchoolNameAction
) {
  if (action.type === ActionType.setSchoolNameRecord && !!action.payload) {
    return action.payload;
  }

  return state;
}

function departmentNameReducer(
  state: DepartmentNameRecord | null = null,
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
  function validateSettings(state: Settings) {
    if (
      !Semester.getSemesterOptions(state.showPreviousSemesters).some(
        (semester) => Semester.equals(semester, state.selectedSemester)
      )
    ) {
      state.selectedSemester = Semester.predictCurrentSemester();
    }

    return state;
  }

  if (action.type === ActionType.loadSettings) {
    if (action.payload) {
      return validateSettings(action.payload);
    }
  } else if (action.type === ActionType.selectSemester) {
    if (action.payload) {
      const newState = { ...state };
      newState.selectedSemester = action.payload;
      return validateSettings(newState);
    }
  } else if (action.type === ActionType.setShowPreviousSemesters) {
    if (typeof action.payload !== "undefined") {
      const newState = { ...state };
      newState.showPreviousSemesters = action.payload;
      return validateSettings(newState);
    }
  }

  return state;
}

function starredClassReducer(
  state: StarredClassRecord | null = null,
  action: StarClassAction
) {
  if (!!action.payload) {
    if (action.type === ActionType.loadStarredClasses) {
      return action.payload;
    } else if (action.type === ActionType.starClass) {
      const newState = { ...state };
      newState[getFullClassCode(action.payload)] = action.payload;
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
