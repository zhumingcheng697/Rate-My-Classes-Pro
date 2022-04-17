import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  DepartmentInfo,
  ClassInfo,
  SectionInfo,
} from "./types";
import { SemesterInfo } from "./semester";
import { isSchoolGrad } from "./utils";

type URLParams = Record<string, string | number | boolean>;

type NameRecord = { name: string };

type SchedgeSchoolNameRecord = Record<string, NameRecord>;

type SchedgeDepartmentNameRecord = Record<string, Record<string, NameRecord>>;

type SchedgeSectionInfo = SectionInfo & { recitations?: any[] };

type SchedgeClassRecord = {
  name: string;
  deptCourseId: string;
  description?: string;
  subjectCode: {
    code: string;
    school: string;
  };
  sections?: SchedgeSectionInfo[];
}[];

const baseUrl = "https://schedge.a1liu.com";

const composeUrl = (path: string, params: URLParams = { full: true }) =>
  baseUrl + path + "?" + composeQuery(params);

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
      record[schoolCode] = name;
    }
  }

  return record;
}

export async function getDepartmentNames() {
  const res = await fetch(composeUrl("/subjects"));
  const json: SchedgeDepartmentNameRecord = await res.json();
  const record: DepartmentNameRecord = {};

  for (let schoolCode in json) {
    if (!record[schoolCode]) {
      record[schoolCode] = {};
    }

    for (let departmentCode of Object.keys(json[schoolCode]).sort()) {
      record[schoolCode][departmentCode] =
        json[schoolCode][departmentCode].name;
    }
  }

  return record;
}

export async function getClasses(
  { schoolCode, departmentCode }: DepartmentInfo,
  semester: SemesterInfo
) {
  const res = await fetch(
    composeUrl(
      `/${semester.year}/${semester.semesterCode}/${schoolCode}/${departmentCode}`
    )
  );

  const json: SchedgeClassRecord = await res.json();

  return json
    .map(({ name, deptCourseId, description }) => ({
      schoolCode,
      departmentCode,
      classNumber: deptCourseId,
      name,
      description: description ?? "",
    }))
    .sort((a, b) => parseInt(a.classNumber) - parseInt(b.classNumber));
}

export async function searchClasses(query: string, semester: SemesterInfo) {
  const res = await fetch(
    composeUrl(`/${semester.year}/${semester.semesterCode}/search`, {
      full: true,
      query,
      limit: 50,
      titleWeight: 3,
      descriptionWeight: 2,
      notesWeight: 0,
      prereqsWeight: 0,
    })
  );

  const json: SchedgeClassRecord = await res.json();

  return json.map(({ name, deptCourseId, description, subjectCode }) => ({
    schoolCode: subjectCode.school,
    departmentCode: subjectCode.code,
    classNumber: deptCourseId,
    name,
    description: description ?? "",
  }));
}

export async function getSections(
  { name, schoolCode, departmentCode, classNumber }: ClassInfo,
  semester: SemesterInfo
) {
  const res = await fetch(
    composeUrl(`/${semester.year}/${semester.semesterCode}/search`, {
      full: true,
      query: name,
      school: schoolCode,
      subject: departmentCode,
      titleWeight: 3,
      descriptionWeight: 0,
      notesWeight: 0,
      prereqsWeight: 0,
    })
  );

  const json: SchedgeClassRecord = await res.json();

  const sections =
    json.find((e) => e.name === name && e.deptCourseId === classNumber)
      ?.sections ?? [];

  sections.forEach((section) => {
    delete section.recitations;
  });

  return sections;
}
