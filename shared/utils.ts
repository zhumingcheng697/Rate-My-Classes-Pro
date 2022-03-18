import {
  type SchoolNameRecord,
  type DepartmentNameRecord,
  type SchoolInfo,
  type DepartmentInfo,
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

export function getSchoolNameByCode(
  schoolCode: string,
  schoolNameRecord: SchoolNameRecord
) {
  return (schoolNameRecord || {})[schoolCode] || schoolCode.toUpperCase();
}

export function getSchoolNameByInfo(
  { schoolCode }: SchoolInfo,
  schoolNameRecord: SchoolNameRecord
) {
  return getSchoolNameByCode(schoolCode, schoolNameRecord);
}

export function getDepartmentNameByCode(
  schoolCode: string,
  departmentCode: string,
  departmentNameRecord: DepartmentNameRecord
) {
  return (
    ((departmentNameRecord || {})[schoolCode] || {})[departmentCode] ||
    departmentCode.toUpperCase()
  );
}

export function getDepartmentNameByInfo(
  { schoolCode, departmentCode }: DepartmentInfo,
  departmentNameRecord: DepartmentNameRecord
) {
  return getDepartmentNameByCode(
    schoolCode,
    departmentCode,
    departmentNameRecord
  );
}
