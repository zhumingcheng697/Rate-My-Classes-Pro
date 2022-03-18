import { runInContext } from "lodash";
import { SchoolNameRecord, DepartmentNameRecord } from "../shared/types";

const baseUrl = "https://schedge.a1liu.com";
const suffix = "?full=true";

const composeUrl = (path: string) => baseUrl + path + suffix;

type NameRecord = {
  name: string;
};

type SchedgeSchoolNameRecord = Record<string, NameRecord>;

type SchedgeDepartmentNameRecord = Record<string, Record<string, NameRecord>>;

export async function getSchoolNames(): Promise<SchoolNameRecord> {
  const res = await fetch(composeUrl("/schools"));
  const json: SchedgeSchoolNameRecord = await res.json();
  const record: SchoolNameRecord = {};

  for (let schoolCode in json) {
    record[schoolCode] = json[schoolCode].name;
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
