export enum SemesterCode {
  jTerm = "ja",
  spring = "sp",
  summer = "su",
  fall = "fa",
}

export default class Semester {
  private static readonly semesterCodes = [
    SemesterCode.jTerm,
    SemesterCode.spring,
    SemesterCode.summer,
    SemesterCode.fall,
  ];

  private static readonly numOfSemesters = Semester.semesterCodes.length;

  readonly semesterCode: SemesterCode;
  readonly year: number;

  constructor(semester: SemesterCode, year: number) {
    this.semesterCode = semester;
    this.year = Math.floor(year);
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
    return `${this.getSemesterName()} ${this.year}`;
  }

  static predictCurrentSemester() {
    const today = new Date();
    const month = today.getMonth() + 1;

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

    return new Semester(semesterCode, today.getFullYear());
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

  static getSemesterOptions(prev: number = 3) {
    const semesterOptions = [];
    let start = Semester.predictCurrentSemester().prev(Math.max(prev, 0));
    const end = Semester.predictFurthestSemester().next();

    while (!Semester.equals(start, end)) {
      semesterOptions.push(start);
      start = start.next();
    }

    return semesterOptions;
  }

  static equals(lhs: Semester, rhs: Semester) {
    return lhs.semesterCode === rhs.semesterCode && lhs.year === rhs.year;
  }

  static between(lhs: Semester, rhs: Semester) {
    return (
      (lhs.year - rhs.year) * Semester.numOfSemesters +
      Semester.semesterCodes.indexOf(lhs.semesterCode) -
      Semester.semesterCodes.indexOf(rhs.semesterCode)
    );
  }

  prev(n: number = 1) {
    return this.next(-n);
  }

  next(n: number = 1) {
    let index =
      Semester.semesterCodes.indexOf(this.semesterCode) + Math.floor(n);
    const year = this.year + Math.floor(index / Semester.numOfSemesters);
    index =
      ((index % Semester.numOfSemesters) + Semester.numOfSemesters) %
      Semester.numOfSemesters;

    return new Semester(Semester.semesterCodes[index], year);
  }
}
