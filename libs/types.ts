import Semester from "./semester";

export type SchoolNameRecord = Record<string, string>;

export type DepartmentNameRecord = Record<string, Record<string, string>>;

export type StarredClassRecord = Record<string, StarredClassInfo>;

export type ReviewedClassRecord = Record<string, ReviewedClassInfo>;

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

export type Settings = {
  selectedSemester: Semester;
  showPreviousSemesters: boolean;
};

export type RootNavigationParamList = {
  "Explore-Tab": undefined;
  "Search-Tab": undefined;
  "Me-Tab": undefined;
};

export type SharedNavigationParamList = {
  Detail: ClassInfo;
  Review: ClassInfo;
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
