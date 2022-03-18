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
  description: string;
};

export type RootNavigationParamList = {
  "Explore-Tab": undefined;
  "Search-Tab": undefined;
  "Me-Tab": undefined;
};

export type ExploreNavigationParamList = {
  "Explore-University": undefined;
  "Explore-School": SchoolInfo;
  "Explore-Department": DepartmentInfo;
  "Explore-Detail": ClassInfo;
};

export type SearchNavigationParamList = {
  "Search-University": undefined;
  "Search-Detail": ClassInfo;
};

export type MeNavigationParamList = {
  "Me-Account": undefined;
  "Me-Starred": undefined;
  "Me-Reviewed": undefined;
  "Me-SignIn": undefined;
  "Me-SignUp": undefined;
  "Me-Detail": ClassInfo;
};
