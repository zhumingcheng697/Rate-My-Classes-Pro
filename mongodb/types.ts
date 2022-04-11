import { SemesterCode } from "../libs/semester";
import { type StarredClassRecord } from "../libs/types";

export enum Collections {
  users = "users",
}

export type UserDoc = {
  _id: string;
  username: string;
  starredClasses: StarredClassRecord;
  settings: {
    selectedSemester: {
      semester: SemesterCode;
      year: number;
    };
    showPreviousSemesters: boolean;
  };
};
