export enum SemesterCode {
  jTerm = "ja",
  spring = "sp",
  summer = "su",
  fall = "fa",
}

export type SemesterInfo = { semesterCode: SemesterCode; year: number };

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

  constructor(
    {
      semesterCode,
      year,
    }: SemesterInfo = Semester.predictCurrentSemester().toJSON()
  ) {
    this.semesterCode = semesterCode;
    this.year = Math.floor(year);
  }

  getSemesterName() {
    return {
      [SemesterCode.jTerm]: "J-Term",
      [SemesterCode.spring]: "Spring",
      [SemesterCode.summer]: "Summer",
      [SemesterCode.fall]: "Fall",
    }[this.semesterCode];
  }

  toCode() {
    return `${this.semesterCode}${this.year}`;
  }

  toString() {
    return `${this.getSemesterName()} ${this.year}`;
  }

  toJSON() {
    return { semesterCode: this.semesterCode, year: this.year };
  }

  validate() {
    return Semester.getSemesterOptions().some((semester) =>
      Semester.equals(semester, this)
    );
  }

  static fromCode(code?: string) {
    const semesterCode = code?.slice(0, 2)?.toLowerCase() as SemesterCode;
    const year = parseInt(code?.slice(2) || "");

    if (year && this.semesterCodes.includes(semesterCode)) {
      const semester = new Semester({ semesterCode, year });
      if (semester.validate()) {
        return semester;
      }
    }

    return undefined;
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

    return new Semester({ semesterCode, year: today.getFullYear() });
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

    return new Semester({ semesterCode, year });
  }

  static getSemesterOptions(showNext: boolean = true, prevCount: number = 4) {
    const semesterOptions = [];
    const current = Semester.predictCurrentSemester();
    let start = current.prev(Math.max(0, prevCount));

    const end = (
      showNext ? Semester.predictFurthestSemester() : current
    ).next();

    while (!Semester.equals(start, end)) {
      semesterOptions.push(start);
      start = start.next();
    }

    return semesterOptions;
  }

  static equals(lhs: SemesterInfo, rhs: SemesterInfo) {
    return lhs.semesterCode === rhs.semesterCode && lhs.year === rhs.year;
  }

  static between(lhs: SemesterInfo, rhs: SemesterInfo) {
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

    return new Semester({ semesterCode: Semester.semesterCodes[index], year });
  }
}
