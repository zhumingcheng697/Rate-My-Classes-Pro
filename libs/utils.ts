import Semester from "./semester";

import {
  type SchoolNameRecord,
  type DepartmentNameRecord,
  type SchoolInfo,
  type DepartmentInfo,
  type ClassCode,
  type ClassInfo,
  type Review,
  type Rating,
  RatingType,
} from "./types";

export function getFullDepartmentCode({
  schoolCode,
  departmentCode,
}: DepartmentInfo): string {
  return `${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()}`.replace(
    /\./g,
    ""
  );
}

export function getFullClassCode({
  schoolCode,
  departmentCode,
  classNumber,
}: ClassCode): string {
  return `${getFullDepartmentCode({
    schoolCode,
    departmentCode,
  })} ${classNumber.toUpperCase().replace(/\./g, "")}`;
}

export function getSchoolName(
  { schoolCode }: SchoolInfo,
  schoolNameRecord: SchoolNameRecord | null
) {
  return (schoolNameRecord ?? {})[schoolCode] || schoolCode.toUpperCase();
}

export function getDepartmentName(
  { schoolCode, departmentCode }: DepartmentInfo,
  departmentNameRecord: DepartmentNameRecord | null
) {
  return (
    ((departmentNameRecord ?? {})[schoolCode] ?? {})[departmentCode] ||
    departmentCode.toUpperCase()
  );
}

export function isSchoolGrad(schoolCode: string) {
  const code = schoolCode.toUpperCase();
  return code.startsWith("G") || code === "DN";
}

export function isObjectEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

export function formSentence(str: string) {
  return (
    str.charAt(0).toUpperCase() +
    str.slice(1) +
    (/^[a-z0-9]$/i.test(str.charAt(str.length - 1)) ? "." : "")
  );
}

export function compareClasses(
  schoolCodes: string[],
  departmentNames: DepartmentNameRecord,
  a: ClassInfo,
  b: ClassInfo
) {
  if (a.schoolCode !== b.schoolCode) {
    return (
      schoolCodes.indexOf(a.schoolCode) - schoolCodes.indexOf(b.schoolCode)
    );
  }

  if (a.departmentCode !== b.departmentCode) {
    const departmentsA = Object.keys(departmentNames[a.schoolCode] ?? {});
    const departmentsB = Object.keys(departmentNames[b.schoolCode] ?? {});
    return (
      departmentsA.indexOf(a.departmentCode) -
      departmentsB.indexOf(b.departmentCode)
    );
  }

  const numberLengthA = a.classNumber.replace(/[^0-9]+/gi, "").length;
  const numberLengthB = b.classNumber.replace(/[^0-9]+/gi, "").length;

  if (numberLengthA !== numberLengthB) {
    return numberLengthA - numberLengthB;
  }

  if (a.classNumber < b.classNumber) {
    return -1;
  } else if (a.classNumber > b.classNumber) {
    return 1;
  } else {
    return 0;
  }
}

export const ratings: Rating[] = [5, 4, 3, 2, 1];

export const ratingDescriptionMap = {
  [RatingType.enjoyment]: {
    [5]: "Really Enjoyed",
    [4]: "Somewhat Enjoyed",
    [3]: "Neutral",
    [2]: "Somewhat Disliked",
    [1]: "Really Disliked",
  },
  [RatingType.difficulty]: {
    [5]: "Really Difficult",
    [4]: "Somewhat Difficult",
    [3]: "Neutral",
    [2]: "Somewhat Easy",
    [1]: "Really Easy",
  },
  [RatingType.workload]: {
    [5]: "Really Heavy",
    [4]: "Somewhat Heavy",
    [3]: "Neutral",
    [2]: "Somewhat Light",
    [1]: "Really Light",
  },
  [RatingType.value]: {
    [5]: "Really Valuable",
    [4]: "Somewhat Valuable",
    [3]: "Neutral",
    [2]: "Somewhat Useless",
    [1]: "Really Useless",
  },
};

export const placeholderReview: Review = {
  userId: "???",
  enjoyment: 5,
  difficulty: 2,
  workload: 2,
  value: 4,
  instructor: "John Sterling",
  semester: Semester.predictCurrentSemester().toJSON(),
  upvotes: {},
  downvotes: {},
  reviewedDate: Date.now(),
  comment:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ullam quas, eaque hic vitae error sit, dolorem id ab natus velit tempora non quasi dolores sed, corporis facere magnam ratione!",
};

export const placeholderClassNumbers = [
  "1001",
  "1003",
  "1113",
  "1114",
  "1123",
  "1133",
  "1134",
  "1143",
  "2023",
  "2024",
  "2034",
  "2124",
  "2193",
  "3144",
  "3193",
  "4193",
  "4793",
  "6313",
];
