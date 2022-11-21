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
  getFullDepartmentCode,
  getFullSemesterCode,
  isSchoolGrad,
} from "./utils";

type URLParams = Record<string, string | number | boolean>;

type NameRecord = { name: string };

type SchedgeSchoolNameRecord = Record<string, NameRecord>;

type SchedgeDepartmentNameRecord = Record<string, Record<string, NameRecord>>;

type SchedgeClassRecord = {
  name: string;
  deptCourseId: string;
  description?: string;
  subjectCode?: string;
  sections?: SectionInfo[];
}[];

const baseUrl = "https://schedge.a1liu.com";

const v2BaseUrl = "https://nyu.a1liu.com/api";

const composeUrl = (path: string, params: URLParams = { full: true }) =>
  baseUrl + path + "?" + composeQuery(params);

const composeV2Url = (path: string, params: URLParams = { full: true }) =>
  v2BaseUrl + path + "?" + composeQuery(params);

const composeQuery = (params: URLParams) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

export async function getSchoolNames() {
  const res = await fetch(composeUrl("/schools"));
  const json: SchedgeSchoolNameRecord = await res.json();
  const record: SchoolNameRecord = {};

  const fallbackMap: Record<string, string> = {
    CD: "College of Dentistry Continuing Education",
    NT: "Non-Credit Tisch School of the Arts",
    GH: "NYU Abu Dhabi - Graduate",
    DN: "College of Dentistry - Graduate",
  };

  for (let schoolCode of Object.keys(json)
    .concat(Object.keys(fallbackMap))
    .sort(
      (a, b) =>
        (isSchoolGrad(a) ? 1 : 0) +
        (a in fallbackMap ? 0.5 : 0) -
        (isSchoolGrad(b) ? 1 : 0) -
        (b in fallbackMap ? 0.5 : 0)
    )) {
    const name =
      json[schoolCode]?.name || fallbackMap[schoolCode.toUpperCase()];

    if (name) {
      record[schoolCode.toUpperCase()] = name;
    }
  }

  return record;
}

export async function getDepartmentNames() {
  const res = await fetch(composeUrl("/subjects"));
  const json: SchedgeDepartmentNameRecord = await res.json();
  const record: DepartmentNameRecord = {};

  for (let schoolCode in json) {
    if (!record[schoolCode.toUpperCase()]) {
      record[schoolCode.toUpperCase()] = {};
    }

    for (let departmentCode of Object.keys(json[schoolCode]).sort()) {
      record[schoolCode.toUpperCase()][departmentCode.toUpperCase()] =
        json[schoolCode][departmentCode].name;
    }
  }

  return record;
}

export async function getClasses(
  { schoolCode, departmentCode }: DepartmentInfo,
  semesterInfo: SemesterInfo
): Promise<ClassInfo[]> {
  const res = await fetch(
    composeV2Url(
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
          name,
          description: description ?? "",
        }))
        .sort((a, b) => parseInt(a.classNumber) - parseInt(b.classNumber))
    : [];
}

export async function getClassWithSections(
  { schoolCode, departmentCode, classNumber }: ClassCode,
  semesterInfo: SemesterInfo
): Promise<ClassInfoWithSections | undefined> {
  console.log("getClassWithSections", semesterInfo);

  const res = await fetch(
    composeV2Url(
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
    name,
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
    composeV2Url(`/search/${getFullSemesterCode(semesterInfo)}`, {
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
      name,
      description: description ?? "",
    };
  });
}

export async function getSections(
  { name, schoolCode, departmentCode, classNumber }: ClassInfo,
  semesterInfo: SemesterInfo
): Promise<SectionInfo[]> {
  const res = await fetch(
    composeV2Url(
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
        e.name === name &&
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
