import { type SemesterInfo } from "./semester";

export type SchoolNameRecord = Record<string, string>;

export type DepartmentNameRecord = Record<string, Record<string, string>>;

export type StarredClassRecord = Record<string, StarredClassInfo>;

export type ReviewedClassRecord = Record<string, ReviewedClassInfo>;

export type ReviewRecord = Record<string, Review>;

export type SchoolInfo = { schoolCode: string };

export type DepartmentInfo = SchoolInfo & { departmentCode: string };

export type ClassCode = DepartmentInfo & {
  classNumber: string;
  name?: string;
  description?: string;
};

export type ClassInfo = Required<ClassCode>;

export type StarredClassInfo = ClassInfo & { starredDate: number };

export type ReviewedClassInfo = ClassInfo & { reviewedDate: number };

export enum ErrorType {
  network = "NETWORK_ERROR",
  noData = "NO_DATA_ERROR",
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export enum RatingType {
  enjoyment = "Enjoyment",
  difficulty = "Difficulty",
  workload = "Workload",
  value = "Value",
}

export enum Vote {
  upvote = "UPVOTE",
  downvote = "DOWNVOTE",
}

export type VoteRecord = Record<string, true>;

export enum ReviewOrder {
  mostRecentSemester = "Most Recent Semester",
  mostRecentReview = "Most Recent Review",
  mostHelpful = "Most Helpful",
  mostRecentSemesterWithComment = "Most Recent Semester (with Comment)",
  mostRecentReviewWithComment = "Most Recent Review (with Comment)",
  mostHelpfulWithComment = "Most Helpful (with Comment)",
}

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

export type SectionInfo = {
  code?: string;
  instructors?: string[];
  type?: string;
  status?: string;
  meetings?: { beginDate: string; minutesDuration: number; endDate: string }[];
  name?: string;
  campus?: string;
  minUnits?: number;
  maxUnits?: number;
  location?: string;
  notes?: string;
  prerequisites?: string;
};

export type Settings = {
  selectedSemester: SemesterInfo;
  showPreviousSemesters: boolean;
};

export type RootNavigationParamList = {
  ExploreTab: undefined;
  SearchTab: undefined;
  MeTab: undefined;
};

export type StarredOrReviewed = "Starred" | "Reviewed";

export type SharedNavigationParamList = {
  Detail: {
    classCode: ClassCode;
    classInfo: ClassInfo;
    deleteReview?: true;
    newReview?: Review;
    query?: string;
    starredOrReviewed?: StarredOrReviewed;
  };
  Review: {
    classCode: ClassCode;
    previousReview?: Review;
    newReview?: Review;
    query?: string;
    starredOrReviewed?: StarredOrReviewed;
  };
  Schedule: {
    classCode: ClassCode;
    semester: SemesterInfo;
    sections?: SectionInfo[];
    query?: string;
    starredOrReviewed?: StarredOrReviewed;
  };
  SignInSignUp: {
    classCode?: ClassCode;
    isSigningUp?: boolean;
    query?: string;
    starredOrReviewed?: StarredOrReviewed;
  };
};

export type ExploreNavigationParamList = {
  University: undefined;
  School: SchoolInfo;
  Department: DepartmentInfo;
} & SharedNavigationParamList;

export type SearchNavigationParamList = {
  Search: { query?: string };
} & SharedNavigationParamList;

export type MeNavigationParamList = {
  Account: { isAuthenticated: boolean } | undefined;
  Starred: undefined;
  Reviewed: undefined;
  Settings: undefined;
} & SharedNavigationParamList;

export type StackNavigationParamList =
  | ExploreNavigationParamList
  | SearchNavigationParamList
  | MeNavigationParamList;

export type NavigationParamListForTab<
  Tab extends keyof RootNavigationParamList
> = Tab extends "ExploreTab"
  ? ExploreNavigationParamList
  : Tab extends "SearchTab"
  ? SearchNavigationParamList
  : MeNavigationParamList;

export type ValueOf<T> = T[keyof T];
