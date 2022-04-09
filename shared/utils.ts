import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  SchoolInfo,
  DepartmentInfo,
  ClassCode,
  ClassInfo,
} from "./types";

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
