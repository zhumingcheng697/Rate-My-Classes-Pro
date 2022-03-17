export type ClassInfo = {
  schoolCode: string;
  departmentCode: string;
  classNumber: string;
  name: string;
  description: string | undefined;
};

export type RootNavigationParamList = {
  "Explore-Tab": undefined;
  "Search-Tab": undefined;
  "Me-Tab": undefined;
};

export type ExploreNavigationParamList = {
  "Explore-University": undefined;
  "Explore-School": { schoolCode: string };
  "Explore-Department": { schoolCode: string; departmentCode: string };
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
