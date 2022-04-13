import { type SemesterInfo } from "./semester";

import { type Rating } from "./rating";

export type SchoolNameRecord = Record<string, string>;

export type DepartmentNameRecord = Record<string, Record<string, string>>;

export type StarredClassRecord = Record<string, StarredClassInfo>;

export type ReviewedClassRecord = Record<string, ReviewedClassInfo>;

export type ReviewRecord = Record<string, Review>;

export type SchoolInfo = { schoolCode: string };

export type DepartmentInfo = SchoolInfo & { departmentCode: string };

export type ClassCode = DepartmentInfo & { classNumber: string };

export type ClassInfo = ClassCode & { name: string; description?: string };

export type StarredClassInfo = ClassInfo & { starredDate: number };

export type ReviewedClassInfo = ClassInfo & { reviewedDate: number };

export enum ErrorType {
  network = "NETWORK_ERROR",
  noData = "NO_DATA_ERROR",
}

export enum Vote {
  upvote = "UPVOTE",
  downvote = "DOWNVOTE",
}

export type VoteRecord = Record<string, true>;

export type Review = {
  userId: string;
  enjoyment: Rating;
  difficulty: Rating;
  workload: Rating;
  value: Rating;
  upvotes: VoteRecord;
  downvotes: VoteRecord;
  reviewedDate: number;
  semester: SemesterInfo;
  instructor: string;
  comment?: string;
};

export type Settings = {
  selectedSemester: SemesterInfo;
  showPreviousSemesters: boolean;
};

export type RootNavigationParamList = {
  "Explore-Tab": undefined;
  "Search-Tab": undefined;
  "Me-Tab": undefined;
};

export type SharedNavigationParamList = {
  Detail: { classInfo: ClassInfo };
  Review: { classInfo: ClassInfo; previousReview?: Review; newReview?: Review };
  SignInSignUp: { isSigningIn: boolean } | undefined;
};

export type ExploreNavigationParamList = {
  University: undefined;
  School: SchoolInfo;
  Department: DepartmentInfo;
} & SharedNavigationParamList;

export type SearchNavigationParamList = {
  Search: undefined;
} & SharedNavigationParamList;

export type MeNavigationParamList = {
  Account: { isAuthenticated: boolean } | undefined;
  Starred: undefined;
  Reviewed: undefined;
  Settings: undefined;
} & SharedNavigationParamList;
