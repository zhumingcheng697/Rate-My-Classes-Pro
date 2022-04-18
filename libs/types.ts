import { type SemesterInfo } from "./semester";

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
  code: string;
  instructors: string[];
  meetings?: { beginDate: string; minutesDuration: number; endDate: string }[];
  name: string;
  campus: string;
  minUnits: number;
  maxUnits: number;
  location: string;
  notes?: string;
  prerequisites?: string;
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
  Detail: { classInfo: ClassInfo; deleteReview?: true; newReview?: Review };
  Review: { classInfo: ClassInfo; previousReview?: Review; newReview?: Review };
  Schedule: {
    classInfo: ClassInfo;
    semester: SemesterInfo;
    sections: SectionInfo[];
  };
  SignInSignUp: { isSigningUp: boolean } | undefined;
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
