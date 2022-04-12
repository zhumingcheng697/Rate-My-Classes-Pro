import { type SemesterInfo } from "../libs/semester";
import type {
  StarredClassRecord,
  ReviewedClassRecord,
  ReviewRecord,
} from "../libs/types";

export enum Collections {
  users = "users",
  classes = "classes",
}

export type UserDoc = {
  _id: string;
  username: string;
  starredClasses: StarredClassRecord;
  reviewedClasses: ReviewedClassRecord;
  settings: {
    selectedSemester: SemesterInfo;
    showPreviousSemesters: boolean;
  };
};

export type ClassDoc = {
  _id: string;
  reviews: ReviewRecord;
};
