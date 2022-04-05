import type {
  SchoolNameRecord,
  DepartmentNameRecord,
  DepartmentInfo,
  ClassInfo,
  SemesterInfo,
} from "../shared/types";
import { predictCurrentSemester } from "./utils";

const baseUrl = "https://schedge.a1liu.com";

const composeUrl = (path: string, query: string = "?full=true") =>
  baseUrl + path + query;

type NameRecord = {
  name: string;
};

type SchedgeSchoolNameRecord = Record<string, NameRecord>;

type SchedgeDepartmentNameRecord = Record<string, Record<string, NameRecord>>;

type SchedgeClassRecord = {
  name: string;
  deptCourseId: string;
  description?: string;
}[];

export async function getSchoolNames(): Promise<SchoolNameRecord> {
  const res = await fetch(composeUrl("/schools"));
  const json: SchedgeSchoolNameRecord = await res.json();
  const record: SchoolNameRecord = {};

  const fallbackMap: Record<string, string> = {
    NT: "Non-Credit Tisch School of the Arts",
    GH: "NYU Abu Dhabi - Graduate",
    CD: "College of Dentistry Continuing Education",
    DN: "College of Dentistry - Graduate",
  };

  for (let schoolCode in json) {
    let name = json[schoolCode].name;
    if (!name) {
      const code = schoolCode.toUpperCase();
      if (code in fallbackMap) {
        name = fallbackMap[code];
      }
    }
    record[schoolCode] = name;
  }

  return record;
}

export async function getDepartmentNames(): Promise<DepartmentNameRecord> {
  const res = await fetch(composeUrl("/subjects"));
  const json: SchedgeDepartmentNameRecord = await res.json();
  const record: DepartmentNameRecord = {};

  for (let schoolCode in json) {
    if (!record[schoolCode]) {
      record[schoolCode] = {};
    }

    for (let departmentCode in json[schoolCode]) {
      record[schoolCode][departmentCode] =
        json[schoolCode][departmentCode].name;
    }
  }

  return record;
}

export async function getClasses(
  { schoolCode, departmentCode }: DepartmentInfo,
  { semester, year }: SemesterInfo
): Promise<ClassInfo[]> {
  const res = await fetch(
    composeUrl(`/${year}/${semester}/${schoolCode}/${departmentCode}`)
  );
  const json: SchedgeClassRecord = await res.json();

  return json
    .map(({ name, description, deptCourseId }) => ({
      schoolCode,
      departmentCode,
      classNumber: deptCourseId,
      name,
      description,
    }))
    .sort((a, b) => parseInt(a.classNumber) - parseInt(b.classNumber));
}
