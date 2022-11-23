import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  DepartmentInfo,
  ClassCode,
  ClassInfo,
  SectionInfo,
  ClassInfoWithSections,
} from "./types";
import { SemesterInfo } from "./semester";
import {
  compareClassNumbers,
  getFullDepartmentCode,
  getFullSemesterCode,
} from "./utils";

type URLParams = Record<string, string | number | boolean>;

type SchedgeSchoolDeparmentNameRecord = {
  schools: {
    name: string;
    subjects: {
      code: string;
      name: string;
    }[];
  }[];
};

type SchedgeClassRecord = {
  name: string;
  deptCourseId: string;
  description?: string;
  subjectCode?: string;
  sections?: SectionInfo[];
}[];

const baseUrl = "https://nyu.a1liu.com/api";

const composeUrl = (path: string, params: URLParams = { full: true }) =>
  baseUrl + path + "?" + composeQuery(params);

const composeQuery = (params: URLParams) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

const cleanUpName = (name?: string) =>
  name
    ? name.replace(/^(?:\| +[A-Z][A-Z0-9]+-[A-Z]{2,3} [0-9]+[A-Z0-9]* +)+/, "")
    : "";

export async function getNameRecordFor(semesterInfo: SemesterInfo) {
  const res = await fetch(
    composeUrl(`/schools/${getFullSemesterCode(semesterInfo)}`)
  );
  const json: SchedgeSchoolDeparmentNameRecord = await res.json();
  const schoolNameRecord: SchoolNameRecord = {};
  const departmentNameRecord: DepartmentNameRecord = {};
  const schoolNameMap: Record<string, Record<string, number>> = {};

  for (let { subjects, name: schoolName } of json.schools) {
    for (let { code, name } of subjects) {
      const match = code.match(/^([^-–]+)(?:-|–)([^-–]{2,3})$/i);
      if (match) {
        const subjectCode = match[1].toUpperCase();
        const schoolCode = match[2].toUpperCase();
        if (!departmentNameRecord[schoolCode]) {
          departmentNameRecord[schoolCode] = {};
        }
        if (!schoolNameMap[schoolCode]) {
          schoolNameMap[schoolCode] = {};
        }
        if (!schoolNameMap[schoolCode][schoolName]) {
          schoolNameMap[schoolCode][schoolName] = 1;
        } else {
          schoolNameMap[schoolCode][schoolName] += 1;
        }
        departmentNameRecord[schoolCode][subjectCode] = name;
      }
    }
  }

  for (let schoolCode in schoolNameMap) {
    const schoolNames = schoolNameMap[schoolCode];
    let name: string | null = null;
    let maxCount = -1;
    for (let schoolName in schoolNames) {
      const count = schoolNames[schoolName];
      if (count > maxCount) {
        maxCount = count;
        name = schoolName;
      }
    }

    if (name) schoolNameRecord[schoolCode] = name;
  }

  return { school: schoolNameRecord, department: departmentNameRecord };
}

export async function getClasses(
  { schoolCode, departmentCode }: DepartmentInfo,
  semesterInfo: SemesterInfo
): Promise<ClassInfo[]> {
  const res = await fetch(
    composeUrl(
      `/courses/${getFullSemesterCode(semesterInfo)}/${getFullDepartmentCode({
        schoolCode,
        departmentCode,
      })}`
    )
  );

  const json: SchedgeClassRecord = await res.json();

  return json && Array.isArray(json)
    ? json
        .map(({ name, deptCourseId, description }) => ({
          schoolCode,
          departmentCode,
          classNumber: deptCourseId,
          name: cleanUpName(name),
          description: description ?? "",
        }))
        .sort((a, b) => compareClassNumbers(a.classNumber, b.classNumber))
    : [];
}

export async function getClassWithSections(
  { schoolCode, departmentCode, classNumber }: ClassCode,
  semesterInfo: SemesterInfo
): Promise<ClassInfoWithSections | undefined> {
  const res = await fetch(
    composeUrl(
      `/courses/${getFullSemesterCode(semesterInfo)}/${getFullDepartmentCode({
        schoolCode,
        departmentCode,
      })}`
    )
  );

  const json: SchedgeClassRecord = await res.json();
  const schedgeClass = json.find(
    (e) =>
      e.deptCourseId === classNumber &&
      e.subjectCode === getFullDepartmentCode({ schoolCode, departmentCode })
  );

  if (!schedgeClass) return undefined;

  const { name, description, sections } = schedgeClass;

  sections?.forEach((section) =>
    section.recitations?.sort((a, b) =>
      (a.code || "") < (b.code || "") ? -1 : 1
    )
  );

  return {
    name: cleanUpName(name),
    schoolCode,
    departmentCode,
    classNumber,
    description: description || "",
    sections: sections || [],
  };
}

export async function searchClasses(
  query: string,
  semesterInfo: SemesterInfo
): Promise<ClassInfo[]> {
  const res = await fetch(
    composeUrl(`/search/${getFullSemesterCode(semesterInfo)}`, {
      query,
      limit: 50,
    })
  );

  const json: SchedgeClassRecord = await res.json();

  return json.map(({ name, deptCourseId, description, subjectCode }) => {
    const [departmentCode, schoolCode] = subjectCode?.split("-") ?? [];
    return {
      schoolCode: schoolCode || "",
      departmentCode: departmentCode || "",
      classNumber: deptCourseId,
      name: cleanUpName(name),
      description: description ?? "",
    };
  });
}

export async function getSections(
  { name, schoolCode, departmentCode, classNumber }: ClassInfo,
  semesterInfo: SemesterInfo
): Promise<SectionInfo[]> {
  const res = await fetch(
    composeUrl(
      `/courses/${getFullSemesterCode(semesterInfo)}/${getFullDepartmentCode({
        schoolCode,
        departmentCode,
      })}`
    )
  );

  const json: SchedgeClassRecord = await res.json();
  const sections =
    json.find(
      (e) =>
        cleanUpName(e.name).toLowerCase() === cleanUpName(name).toLowerCase() &&
        e.deptCourseId === classNumber &&
        e.subjectCode === getFullDepartmentCode({ schoolCode, departmentCode })
    )?.sections ?? [];

  sections.forEach((section) =>
    section.recitations?.sort((a, b) =>
      (a.code || "") < (b.code || "") ? -1 : 1
    )
  );

  return sections;
}
