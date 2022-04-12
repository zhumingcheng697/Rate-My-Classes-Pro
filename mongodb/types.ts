import { SemesterCode } from "../libs/semester";
import type { StarredClassRecord, ReviewedClassRecord } from "../libs/types";

export enum Collections {
  users = "users",
}

export type UserDoc = {
  _id: string;
  username: string;
  starredClasses: StarredClassRecord;
  reviewedClasses: ReviewedClassRecord;
  settings: {
    selectedSemester: {
      semester: SemesterCode;
      year: number;
    };
    showPreviousSemesters: boolean;
  };
};
