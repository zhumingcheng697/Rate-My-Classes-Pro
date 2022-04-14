import { combineReducers } from "redux";
import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  StarredClassRecord,
  ReviewedClassRecord,
  Settings,
} from "../libs/types";
import {
  type SchoolNameAction,
  type DepartmentNameAction,
  type StarClassAction,
  type ReviewClassAction,
  type SettingsAction,
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
    selectedSemester: Semester.predictCurrentSemester().toJSON(),
    showPreviousSemesters: false,
  },
  action: SettingsAction
) {
  function validateSettings(state: Settings) {
    if (
      !Semester.getSemesterOptions(state.showPreviousSemesters).some(
        (semester) =>
          Semester.equals(semester, new Semester(state.selectedSemester))
      )
    ) {
      state.selectedSemester = Semester.predictCurrentSemester().toJSON();
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
      newState.selectedSemester = action.payload.toJSON();
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

// function starredClassReducer(
//   state: StarredClassRecord | null = null,
//   action: StarClassAction
// ) {
//   if (!!action.payload) {
//     if (action.type === ActionType.loadStarredClasses) {
//       return action.payload;
//     } else if (action.type === ActionType.starClass) {
//       const newState = { ...state };
//       newState[getFullClassCode(action.payload)] = action.payload;
//       return newState;
//     } else if (action.type === ActionType.unstarClass) {
//       const newState = { ...state };
//       delete newState[getFullClassCode(action.payload)];
//       return newState;
//     }
//   }

//   return state;
// }

// function reviewedClassReducer(
//   state: ReviewedClassRecord | null = null,
//   action: ReviewClassAction
// ) {
//   if (!!action.payload) {
//     if (action.type === ActionType.loadReviewedClasses) {
//       return action.payload;
//     } else if (action.type === ActionType.reviewClass) {
//       const newState = { ...state };
//       newState[getFullClassCode(action.payload)] = action.payload;
//       return newState;
//     } else if (action.type === ActionType.unreviewClass) {
//       const newState = { ...state };
//       delete newState[getFullClassCode(action.payload)];
//       return newState;
//     }
//   }

//   return state;
// }

function starredReviewedClassReducer(
  state: StarredClassRecord | ReviewedClassRecord | null = null,
  action: StarClassAction | ReviewClassAction
) {
  if (!!action.payload) {
    switch (action.type) {
      case ActionType.loadStarredClasses:
      case ActionType.loadReviewedClasses:
        return action.payload;
      case ActionType.starClass:
      case ActionType.reviewClass: {
        const newState: StarredClassRecord | ReviewedClassRecord = { ...state };
        newState[getFullClassCode(action.payload)] = action.payload;
        return newState;
      }
      case ActionType.unstarClass:
      case ActionType.unreviewClass: {
        const newState: StarredClassRecord | ReviewedClassRecord = { ...state };
        delete newState[getFullClassCode(action.payload)];
        return newState;
      }
    }
  }

  return state;
}

export default combineReducers({
  schoolNameRecord: schoolNameReducer,
  departmentNameRecord: departmentNameReducer,
  settings: settingsReducer,
  starredClassRecord: starredReviewedClassReducer,
  reviewedClassRecord: starredReviewedClassReducer,
});
