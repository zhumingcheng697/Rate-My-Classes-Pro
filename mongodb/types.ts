import { SemesterCode } from "../libs/semester";
import { type StarredClassInfo } from "../libs/types";

export enum Collections {
  users = "users",
}

export type UserDoc = {
  _id: string;
  username: string;
  starredClasses: StarredClassInfo[];
  settings: {
    selectedSemester: {
      semester: SemesterCode;
      year: number;
    };
    showPreviousSemesters: boolean;
  };
};
