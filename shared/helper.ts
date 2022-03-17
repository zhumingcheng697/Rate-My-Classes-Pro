import { type ClassInfo } from "./types";

export function getClassCode({
  schoolCode,
  departmentCode,
  classNumber,
}: ClassInfo): string {
  return `${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()} ${classNumber.toUpperCase()}`;
}
