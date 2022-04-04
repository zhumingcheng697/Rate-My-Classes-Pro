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

export type RootNavigationParamList = {
  "Explore-Tab": never;
  "Search-Tab": never;
  "Me-Tab": never;
};

export type ExploreNavigationParamList = {
  University: never;
  School: SchoolInfo;
  Department: DepartmentInfo;
  Detail: ClassInfo;
  Review: ClassInfo;
};

export type SearchNavigationParamList = {
  Search: never;
  Detail: ClassInfo;
  Review: ClassInfo;
};

export type MeNavigationParamList = {
  Account: never;
  Starred: never;
  Reviewed: never;
  Settings: never;
  SignIn: never;
  SignUp: never;
  Detail: ClassInfo;
  Review: ClassInfo;
};
