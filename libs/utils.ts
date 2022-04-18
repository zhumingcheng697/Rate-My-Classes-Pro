import Semester from "./semester";

import {
  type SchoolNameRecord,
  type DepartmentNameRecord,
  type SchoolInfo,
  type DepartmentInfo,
  type ClassCode,
  type ClassInfo,
  type Review,
  type Rating,
  RatingType,
  ReviewOrder,
} from "./types";

export function getFullDepartmentCode({
  schoolCode,
  departmentCode,
}: DepartmentInfo): string {
  return `${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()}`.replace(
    /\./g,
    ""
  );
}

export function getFullClassCode({
  schoolCode,
  departmentCode,
  classNumber,
}: ClassCode): string {
  return `${getFullDepartmentCode({
    schoolCode,
    departmentCode,
  })} ${classNumber.toUpperCase().replace(/\./g, "")}`;
}

export function getSchoolName(
  { schoolCode }: SchoolInfo,
  schoolNameRecord: SchoolNameRecord | null
) {
  return (schoolNameRecord ?? {})[schoolCode] || schoolCode.toUpperCase();
}

export function getDepartmentName(
  { schoolCode, departmentCode }: DepartmentInfo,
  departmentNameRecord: DepartmentNameRecord | null
) {
  return (
    ((departmentNameRecord ?? {})[schoolCode] ?? {})[departmentCode] ||
    departmentCode.toUpperCase()
  );
}

export function isSchoolGrad(schoolCode: string) {
  const code = schoolCode.toUpperCase();
  return code.startsWith("G") || code === "DN";
}

export function isObjectEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

export function prepend(str: string, prefix: string, separator: string) {
  if (str.toUpperCase().startsWith(prefix.toUpperCase())) {
    return str;
  }
  return prefix + separator + str;
}

export function stripLineBreaks(str: string) {
  return str
    .replace(/([a-z0-9])[\s\n]+([^\s\n])/gi, "$1 $2")
    .replace(/^[\s\n]+|[\s\n]+$/gi, "")
    .replace(/(\s*\n\s*)+/g, "\n");
}

export function formSentence(str: string) {
  return (
    str.charAt(0).toUpperCase() +
    str.slice(1) +
    (/^[a-z0-9]$/i.test(str.charAt(str.length - 1)) ? "." : "")
  );
}

export function smartJoin(tokens: string[]) {
  if (tokens.length === 0) return "";
  if (tokens.length === 1) return tokens[0];
  if (tokens.length === 2) return tokens[0] + " and " + tokens[1];

  const result = [];

  for (let i = 0; i < tokens.length - 1; ++i) {
    result.push(tokens[i], ", ");
  }

  result.push("and ", tokens[tokens.length - 1]);

  return result.join("");
}

export function getMeetingScheduleString(meetings: [Date, Date][]) {
  const getTimeString = (date: Date) =>
    date.toLocaleString(undefined, {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    });

  const getWeekDayString = (date: Date) =>
    date.toLocaleString(undefined, { weekday: "long" });

  const schedule: Record<number, [Date, Date][]> = {};

  for (let [begin, end] of meetings) {
    if (!schedule[begin.getDay()]) {
      schedule[begin.getDay()] = [];
    }
    schedule[begin.getDay()].push([begin, end]);
  }

  const stringnifiedSchedule: Record<number, string> = {};

  for (let day in schedule) {
    schedule[day].sort(([a], [b]) => a.valueOf() - b.valueOf());
    stringnifiedSchedule[day] = schedule[day]
      .map(([begin, end]) => `${getTimeString(begin)}–${getTimeString(end)}`)
      .join(", ");
  }

  const finalSchedule: [string, string][] = [];

  const daysOfWeek = [1, 2, 3, 4, 5, 6, 0];

  for (let i = 0; i < 7; ++i) {
    const day = daysOfWeek[i];
    if (day in schedule) {
      const currDay = [getWeekDayString(schedule[day][0][0])];
      const currMeeting = stringnifiedSchedule[day];
      delete schedule[day];

      for (let j = i + 1; j < 7; ++j) {
        const otherDay = daysOfWeek[j];

        if (
          otherDay in schedule &&
          stringnifiedSchedule[otherDay] === currMeeting
        ) {
          currDay.push(getWeekDayString(schedule[otherDay][0][0]));
          delete schedule[otherDay];
        }
      }

      finalSchedule.push([smartJoin(currDay), currMeeting]);
    }
  }

  return finalSchedule;
}

export function compareClasses(
  schoolCodes: string[],
  departmentNames: DepartmentNameRecord,
  a: ClassInfo,
  b: ClassInfo
) {
  if (a.schoolCode !== b.schoolCode) {
    return (
      schoolCodes.indexOf(a.schoolCode) - schoolCodes.indexOf(b.schoolCode)
    );
  }

  if (a.departmentCode !== b.departmentCode) {
    const departmentsA = Object.keys(departmentNames[a.schoolCode] ?? {});
    const departmentsB = Object.keys(departmentNames[b.schoolCode] ?? {});
    return (
      departmentsA.indexOf(a.departmentCode) -
      departmentsB.indexOf(b.departmentCode)
    );
  }

  const numberLengthA = a.classNumber.replace(/[^0-9]+/gi, "").length;
  const numberLengthB = b.classNumber.replace(/[^0-9]+/gi, "").length;

  if (numberLengthA !== numberLengthB) {
    return numberLengthA - numberLengthB;
  }

  if (a.classNumber < b.classNumber) {
    return -1;
  } else if (a.classNumber > b.classNumber) {
    return 1;
  } else {
    return 0;
  }
}

export const reviewOrders = [
  ReviewOrder.mostRecentSemester,
  ReviewOrder.mostRecentReview,
  ReviewOrder.mostHelpful,
  ReviewOrder.mostRecentSemesterWithComment,
  ReviewOrder.mostRecentReviewWithComment,
  ReviewOrder.mostHelpfulWithComment,
];

export const compareReviews = (() => {
  const sortByMostRecentSemester = (a?: Review, b?: Review) =>
    Semester.between(new Semester(b?.semester), new Semester(a?.semester)) ||
    sortByMostRecentReview(a, b);

  const sortByMostRecentReview = (a?: Review, b?: Review) =>
    (b?.reviewedDate ?? 0) - (a?.reviewedDate ?? 0);

  const sortByMostHelpful = (a?: Review, b?: Review) =>
    Object.keys(b?.upvotes ?? {}).length -
      Object.keys(b?.downvotes ?? {}).length -
      Object.keys(a?.upvotes ?? {}).length +
      Object.keys(a?.downvotes ?? {}).length || sortByMostRecentSemester(a, b);

  const sortByMostRecentSemesterWithComment = (a?: Review, b?: Review) =>
    !!a?.comment === !!b?.comment
      ? sortByMostRecentSemester(a, b)
      : (!!b?.comment ? 1 : 0) - (!!a?.comment ? 1 : 0);

  const sortByMostRecentReviewWithComment = (a?: Review, b?: Review) =>
    !!a?.comment === !!b?.comment
      ? sortByMostRecentReview(a, b)
      : (!!b?.comment ? 1 : 0) - (!!a?.comment ? 1 : 0);

  const sortByMostHelpfulWithComment = (a?: Review, b?: Review) =>
    !!a?.comment === !!b?.comment
      ? sortByMostHelpful(a, b)
      : (!!b?.comment ? 1 : 0) - (!!a?.comment ? 1 : 0);

  const sortFunc = {
    [ReviewOrder.mostRecentSemester]: sortByMostRecentSemester,
    [ReviewOrder.mostRecentReview]: sortByMostRecentReview,
    [ReviewOrder.mostHelpful]: sortByMostHelpful,
    [ReviewOrder.mostRecentSemesterWithComment]:
      sortByMostRecentSemesterWithComment,
    [ReviewOrder.mostRecentReviewWithComment]:
      sortByMostRecentReviewWithComment,
    [ReviewOrder.mostHelpfulWithComment]: sortByMostHelpfulWithComment,
  };

  return (reviewOrder: ReviewOrder) => sortFunc[reviewOrder];
})();

export const ratings: Rating[] = [5, 4, 3, 2, 1];

export const ratingDescriptionMap = {
  [RatingType.enjoyment]: {
    [5]: "Really Enjoyed",
    [4]: "Somewhat Enjoyed",
    [3]: "Neutral",
    [2]: "Somewhat Disliked",
    [1]: "Really Disliked",
  },
  [RatingType.difficulty]: {
    [5]: "Really Difficult",
    [4]: "Somewhat Difficult",
    [3]: "Neutral",
    [2]: "Somewhat Easy",
    [1]: "Really Easy",
  },
  [RatingType.workload]: {
    [5]: "Really Heavy",
    [4]: "Somewhat Heavy",
    [3]: "Neutral",
    [2]: "Somewhat Light",
    [1]: "Really Light",
  },
  [RatingType.value]: {
    [5]: "Really Valuable",
    [4]: "Somewhat Valuable",
    [3]: "Neutral",
    [2]: "Somewhat Useless",
    [1]: "Really Useless",
  },
};

export const placeholderReview: Review = {
  userId: "???",
  enjoyment: 5,
  difficulty: 2,
  workload: 2,
  value: 4,
  instructor: "John Sterling",
  semester: Semester.predictCurrentSemester().toJSON(),
  upvotes: {},
  downvotes: {},
  reviewedDate: Date.now(),
  comment:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque ullam quas, eaque hic vitae error sit, dolorem id ab natus velit tempora non quasi dolores sed, corporis facere magnam ratione!",
};

export const placeholderClassNumbers = [
  "1001",
  "1003",
  "1113",
  "1114",
  "1123",
  "1133",
  "1134",
  "1143",
  "2023",
  "2024",
  "2034",
  "2124",
  "2193",
  "3144",
  "3193",
  "4193",
  "4793",
  "6313",
];
