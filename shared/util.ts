import { type ClassCode } from "./types";

export function getClassCode({
  schoolCode,
  departmentCode,
  classNumber,
}: ClassCode): string {
  return `${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()} ${classNumber.toUpperCase()}`;
}

export function isSchoolGrad(schoolCode: string) {
  return schoolCode.at(0)?.toUpperCase() === "G";
}
