import type {
  StarredClassRecord,
  ReviewedClassRecord,
  ReviewRecord,
  Settings,
} from "../libs/types";

export enum Collections {
  users = "users",
  reviews = "reviews",
}

export type UserDoc = {
  _id: string;
  username: string;
  starredClasses: StarredClassRecord;
  reviewedClasses: ReviewedClassRecord;
  settings: Settings;
};

export type ReviewDoc = { _id: string } & ReviewRecord;
