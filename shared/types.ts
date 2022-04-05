export type SchoolNameRecord = Record<string, string>;

export type DepartmentNameRecord = Record<string, Record<string, string>>;

export type StarredClassRecord = Record<string, ClassInfo>;

export type SchoolInfo = {
  schoolCode: string;
};

export type DepartmentInfo = SchoolInfo & {
  departmentCode: string;
};

export type ClassCode = DepartmentInfo & {
  classNumber: string;
};

export type ClassInfo = ClassCode & {
  name: string;
  description?: string;
};

export enum ErrorType {
  loadFailed = "LOAD_FAILED",
  noData = "NO_DATA",
}

export enum SemesterCode {
  jTerm = "ja",
  spring = "sp",
  summer = "su",
  fall = "fa",
}

export type SemesterInfo = {
  semester: SemesterCode;
  year: number;
};

export type RootNavigationParamList = {
  "Explore-Tab": never;
  "Search-Tab": never;
  "Me-Tab": never;
};

export type ExploreNavigationParamList = {
  University: undefined;
  School: SchoolInfo;
  Department: DepartmentInfo;
  Detail: ClassInfo;
  Review: ClassInfo;
};

export type SearchNavigationParamList = {
  Search: undefined;
  Detail: ClassInfo;
  Review: ClassInfo;
};

export type MeNavigationParamList = {
  Account: undefined;
  Starred: undefined;
  Reviewed: undefined;
  Settings: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Detail: ClassInfo;
  Review: ClassInfo;
};
export type RootNavigationParamList = {
  "Explore-Tab": undefined;
  "Search-Tab": undefined;
  "Me-Tab": undefined;
};
