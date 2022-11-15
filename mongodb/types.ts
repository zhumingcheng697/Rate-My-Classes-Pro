import type {
  ReviewRecord,
  Settings,
  StarredClassInfo,
  ReviewedClassInfo,
} from "../libs/types";

export enum Collections {
  users = "users",
  reviews = "reviews",
}

export type UserDoc = {
  _id: string;
  username: string;
  starred: StarredClassInfo[];
  reviewed: ReviewedClassInfo[];
  settings: Settings;
  verified?: boolean;
};

export type ReviewDoc = { _id: string } & ReviewRecord;
