import { type ClassCode, type SchoolInfo } from "./types";

export function getClassCode({
  schoolCode,
  departmentCode,
  classNumber,
}: ClassCode): string {
  return `${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()} ${classNumber.toUpperCase()}`;
}

export function isSchoolGrad({ schoolCode }: SchoolInfo) {
  return schoolCode.at(0)?.toUpperCase() === "G";
}
