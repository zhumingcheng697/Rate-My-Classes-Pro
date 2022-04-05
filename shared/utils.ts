import {
  type SchoolNameRecord,
  type DepartmentNameRecord,
  type SchoolInfo,
  type DepartmentInfo,
  type ClassCode,
  SemesterType,
  SemesterInfo,
} from "./types";

export const semesters = [
  SemesterType.fa,
  SemesterType.ja,
  SemesterType.sp,
  SemesterType.su,
];

export function predictCurrentSemester() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  let semester;

  if (month <= 1) {
    semester = SemesterType.ja;
  } else if (month <= 5) {
    semester = SemesterType.sp;
  } else if (month <= 8) {
    semester = SemesterType.su;
  } else {
    semester = SemesterType.fa;
  }

  return { semester, year };
}

export function getSemesterName(semesterCode: SemesterType) {
  switch (semesterCode) {
    case SemesterType.fa:
      return "Fall";
    case SemesterType.ja:
      return "J-Term";
    case SemesterType.sp:
      return "Spring";
    case SemesterType.su:
      return "Summer";
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
