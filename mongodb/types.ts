import type {
  StarredClassRecord,
  ReviewedClassRecord,
  ReviewRecord,
  Settings,
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
  settings: Settings;
};

export type ClassDoc = {
  _id: string;
  reviews: ReviewRecord;
};
