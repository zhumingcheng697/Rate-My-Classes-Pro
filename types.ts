type DetailScreenParam = {
  school: string;
  department: string;
  code: string;
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
  "Explore-School": { school: string };
  "Explore-Department": { school: string; department: string };
  "Explore-Detail": DetailScreenParam;
};

export type SearchNavigationParamList = {
  "Search-University": undefined;
  "Search-Detail": DetailScreenParam;
};

export type MeNavigationParamList = {
  "Me-Account": undefined;
  "Me-Starred": undefined;
  "Me-Reviewed": undefined;
  "Me-SignIn": undefined;
  "Me-SignUp": undefined;
};
