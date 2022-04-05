import { mod } from "./utils";

export enum SemesterCode {
  jTerm = "ja",
  spring = "sp",
  summer = "su",
  fall = "fa",
}

export default class Semester {
  static readonly semesterCodes = [
    SemesterCode.jTerm,
    SemesterCode.spring,
    SemesterCode.summer,
    SemesterCode.fall,
  ];

  private static numOfSemesters = Semester.semesterCodes.length;

  readonly semesterCode: SemesterCode;
  readonly schoolYear: number;

  constructor(semester: SemesterCode, schoolYear: number) {
    this.semesterCode = semester;
    this.schoolYear = Math.floor(schoolYear);
  }

  getSemesterName() {
    switch (this.semesterCode) {
      case SemesterCode.jTerm:
        return "J-Term";
      case SemesterCode.spring:
        return "Spring";
      case SemesterCode.summer:
        return "Summer";
      case SemesterCode.fall:
        return "Fall";
    }
  }

  toString() {
    return `${this.getSemesterName()} ${this.schoolYear}`;
  }

  static predictCurrentSemester() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    let semesterCode;

    if (month <= 1) {
      semesterCode = SemesterCode.jTerm;
    } else if (month <= 5) {
      semesterCode = SemesterCode.spring;
    } else if (month <= 8) {
      semesterCode = SemesterCode.summer;
    } else {
      semesterCode = SemesterCode.fall;
    }

    return new Semester(semesterCode, year);
  }

  static predictFurthestSemester() {
    const today = new Date();
    const month = today.getMonth() + 1;
    let year = today.getFullYear();

    let semesterCode;

    if (month < 3) {
      semesterCode = SemesterCode.summer;
    } else if (month < 9) {
      semesterCode = SemesterCode.fall;
    } else if (month < 10) {
      semesterCode = SemesterCode.jTerm;
      year += 1;
    } else {
      semesterCode = SemesterCode.spring;
      year += 1;
    }

    return new Semester(semesterCode, year);
  }

  static equals(lhs: Semester, rhs: Semester) {
    return (
      lhs.semesterCode === rhs.semesterCode && rhs.schoolYear === rhs.schoolYear
    );
  }

  prev(n: number = -1) {
    return this.next(n);
  }

  next(n: number = 1) {
    let index =
      Semester.semesterCodes.indexOf(this.semesterCode) + Math.floor(n);
    const year = this.schoolYear + Math.floor(index / Semester.numOfSemesters);
    index = mod(index, Semester.numOfSemesters);

    return new Semester(Semester.semesterCodes[index], year);
  }
}
