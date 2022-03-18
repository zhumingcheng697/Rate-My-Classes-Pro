import {
  type SchoolNameRecord,
  type DepartmentNameRecord,
  type ClassCode,
} from "./types";

export function getClassCode({
  schoolCode,
  departmentCode,
  classNumber,
}: ClassCode): string {
  return `${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()} ${classNumber.toUpperCase()}`;
}

export function isSchoolGrad(schoolCode: string) {
  const code = schoolCode.toUpperCase();
  return code.startsWith("G") || code === "DN";
}

export function isObjectEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

export function getSchoolName(
  schoolCode: string,
  schoolNameRecord: SchoolNameRecord
) {
  return (schoolNameRecord || {})[schoolCode] || schoolCode.toUpperCase();
}

export function getDepartmentName(
  schoolCode: string,
  departmentCode: string,
  departmentNameRecord: DepartmentNameRecord
) {
  return (
    ((departmentNameRecord || {})[schoolCode] || {})[departmentCode] ||
    departmentCode.toUpperCase()
  );
}
