import {
  type SchoolNameRecord,
  type DepartmentNameRecord,
  type SchoolInfo,
  type DepartmentInfo,
  type ClassCode,
  SemesterCode,
  SemesterInfo,
} from "./types";

export const semesters = [
  SemesterCode.jTerm,
  SemesterCode.spring,
  SemesterCode.summer,
  SemesterCode.fall,
];

export function predictCurrentSemester() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  let semester;

  if (month <= 1) {
    semester = SemesterCode.jTerm;
  } else if (month <= 5) {
    semester = SemesterCode.spring;
  } else if (month <= 8) {
    semester = SemesterCode.summer;
  } else {
    semester = SemesterCode.fall;
  }

  return { semester, year };
}

export function predictFurthestSemester() {
  const today = new Date();
  const month = today.getMonth() + 1;
  let year = today.getFullYear();

  let semester;

  if (month < 3) {
    semester = SemesterCode.summer;
  } else if (month < 9) {
    semester = SemesterCode.fall;
  } else if (month < 10) {
    semester = SemesterCode.jTerm;
    year += 1;
  } else {
    semester = SemesterCode.spring;
    year += 1;
  }

  return { semester, year };
}

export function getSemesterName(semesterCode: SemesterCode) {
  switch (semesterCode) {
    case SemesterCode.jTerm:
      return "J-Term";
    case SemesterCode.spring:
      return "Spring";
    case SemesterCode.summer:
      return "Summer";
    case SemesterCode.fall:
      return "Fall";
  }
}

export function getFullSemesterName({ semester, year }: SemesterInfo) {
  return `${getSemesterName(semester)} ${year}`;
}

export function getFullDepartmentCode({
  schoolCode,
  departmentCode,
}: DepartmentInfo): string {
  return `${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()}`;
}

export function getFullClassCode({
  schoolCode,
  departmentCode,
  classNumber,
}: ClassCode): string {
  return `${getFullDepartmentCode({
    schoolCode,
    departmentCode,
  })} ${classNumber.toUpperCase()}`;
}

export function getSchoolName(
  { schoolCode }: SchoolInfo,
  schoolNameRecord: SchoolNameRecord
) {
  return (schoolNameRecord || {})[schoolCode] || schoolCode.toUpperCase();
}

export function getDepartmentName(
  { schoolCode, departmentCode }: DepartmentInfo,
  departmentNameRecord: DepartmentNameRecord
) {
  return (
    ((departmentNameRecord || {})[schoolCode] || {})[departmentCode] ||
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
