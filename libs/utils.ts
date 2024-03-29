import Semester, { type SemesterInfo } from "./semester";
import {
  type RootNavigationParamList,
  type RouteNameFor,
  type RouteParamsFor,
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
  Settings,
} from "./types";

export function tryCatch<T>(callback: () => T) {
  try {
    return callback();
  } catch (e) {
    console.error(e);
  }
}

export async function asyncTryCatch<T>(callback: () => Promise<T>) {
  try {
    return await callback();
  } catch (e) {
    console.error(e);
  }
}

export function getFullDepartmentCode({
  schoolCode,
  departmentCode,
}: DepartmentInfo): string {
  return `${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()}`.replace(
    /\./g,
    ""
  );
}

export function getFullSemesterCode({ semesterCode, year }: SemesterInfo) {
  return `${semesterCode}${year}`;
}

export function getFullClassCode({
  schoolCode,
  departmentCode,
  classNumber,
}: ClassCode) {
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

export function extractClassCode({
  schoolCode,
  departmentCode,
  classNumber,
}: ClassCode): ClassCode {
  return { schoolCode, departmentCode, classNumber };
}

export function extractClassInfo({
  schoolCode,
  departmentCode,
  classNumber,
  name,
  description,
}: ClassInfo): ClassInfo {
  return { schoolCode, departmentCode, classNumber, name, description };
}

export function validateSettings(settings: Settings) {
  const semester = new Semester(settings.selectedSemester);
  if (!semester.validate()) {
    settings.selectedSemester = Semester.predictCurrentSemester().toJSON();
  }

  return settings;
}

export function isSchoolGrad(schoolCode: string) {
  const code = schoolCode.toUpperCase();
  return /^G|^(?:DN|ML|LW)$/.test(code);
}

export function composeErrorMessage(
  error: any,
  fallback: string = "Unknown Error"
) {
  if (error) {
    if (typeof error === "string") {
      return formSentence(error);
    }
    if (!isObjectEmpty(error)) {
      const err = error.message || error.error || error.type;
      if (err) return formSentence(err);
    }
    if (!/^(?:\[object [a-z0-9_]+\]|Error)$/i.test(`${error}`)) {
      return formSentence(`${error}`);
    }
    const stringified = JSON.stringify(error);
    if (stringified !== "{}") {
      return stringified;
    }
  }
  return fallback;
}

export function composeUsername({
  fullName,
  givenName,
  middleName,
  familyName,
  nickname,
}: {
  fullName?: string | null;
  givenName?: string | null;
  middleName?: string | null;
  familyName?: string | null;
  nickname?: string | null;
}) {
  if (fullName) return fullName;

  const nameComponents = givenName
    ? familyName
      ? [givenName, middleName, familyName]
      : [givenName]
    : [nickname];

  return nameComponents.filter(Boolean).join(" ") || null;
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

export function notOfferedMessage(
  classCode: ClassCode,
  classInfo: ClassInfo | null | undefined,
  semesterInfo: SemesterInfo
) {
  const semester = new Semester(semesterInfo);

  const diff = Semester.between(Semester.predictCurrentSemester(), semester);

  return `${
    classInfo
      ? `${classInfo.name} (${getFullClassCode(classCode)})`
      : getFullClassCode(classCode)
  } ${
    diff > 0
      ? "was not offered"
      : diff < 0
      ? "will not be offered"
      : "is not offered"
  } in ${semester.toString()}.`;
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

  const weeklySchedule: Record<number, [Date, Date][]> = {};

  for (let [begin, end] of meetings) {
    if (!weeklySchedule[begin.getDay()]) {
      weeklySchedule[begin.getDay()] = [];
    }
    weeklySchedule[begin.getDay()].push([begin, end]);
  }

  const stringifiedSchedule: Record<number, string> = {};

  const sortDate = ([a]: [Date, Date], [b]: [Date, Date]) =>
    a.valueOf() - b.valueOf();

  for (let day in weeklySchedule) {
    const stringifiedDailySchedule: Set<string> = new Set();

    const stringifySchedule = ([begin, end]: [Date, Date]) =>
      stringifiedDailySchedule.add(
        `${getTimeString(begin)}–${getTimeString(end)}`
      );

    weeklySchedule[day].sort(sortDate).forEach(stringifySchedule);

    stringifiedSchedule[day] = [...stringifiedDailySchedule].join(", ");
  }

  const finalSchedule: [string, string][] = [];

  const daysOfWeek = [1, 2, 3, 4, 5, 6, 0];

  for (let i = 0; i < 7; ++i) {
    const day = daysOfWeek[i];
    if (day in weeklySchedule) {
      const currDay = [getWeekDayString(weeklySchedule[day][0][0])];
      const currMeeting = stringifiedSchedule[day];
      delete weeklySchedule[day];

      for (let j = i + 1; j < 7; ++j) {
        const otherDay = daysOfWeek[j];

        if (
          otherDay in weeklySchedule &&
          stringifiedSchedule[otherDay] === currMeeting
        ) {
          currDay.push(getWeekDayString(weeklySchedule[otherDay][0][0]));
          delete weeklySchedule[otherDay];
        }
      }

      finalSchedule.push([smartJoin(currDay), currMeeting]);
    }
  }

  return finalSchedule;
}

export function compareSchools(a: string, b: string) {
  const isGradA = isSchoolGrad(a);
  const isGradB = isSchoolGrad(b);

  if (isGradA === isGradB) {
    const isStandardA = /^(?:U|G)/.test(a);
    const isStandardB = /^(?:U|G)/.test(b);

    if (isStandardA === isStandardB) {
      return a < b ? -1 : 1;
    } else if (isStandardA) {
      return -1;
    } else {
      return 1;
    }
  } else if (isGradA) {
    return 1;
  } else {
    return -1;
  }
}

export function compareDepartments(
  departmentNames: DepartmentNameRecord,
  schoolCode: string,
  a: string,
  b: string
) {
  const departmenNameA = departmentNames[schoolCode]?.[a];
  const departmenNameB = departmentNames[schoolCode]?.[b];
  return departmenNameA && departmenNameB
    ? departmenNameA < departmenNameB
      ? -1
      : 1
    : a < b
    ? -1
    : 1;
}

export function compareClassNumbers(a: string, b: string) {
  const numberLengthA = a.replace(/[^0-9]+/gi, "").length;
  const numberLengthB = b.replace(/[^0-9]+/gi, "").length;

  if (numberLengthA !== numberLengthB) {
    return numberLengthA - numberLengthB;
  }

  return a < b ? -1 : 1;
}

export function compareClasses(
  departmentNames: DepartmentNameRecord,
  a: ClassCode,
  b: ClassCode
) {
  if (a.schoolCode !== b.schoolCode) {
    return compareSchools(a.schoolCode, b.schoolCode);
  }

  if (a.departmentCode !== b.departmentCode) {
    return compareDepartments(
      departmentNames,
      a.schoolCode,
      a.departmentCode,
      b.departmentCode
    );
  }

  return compareClassNumbers(a.classNumber, b.classNumber);
}

export function hasEditedReview(
  review: Review | undefined,
  enjoyment: Rating,
  difficulty: Rating,
  workload: Rating,
  value: Rating,
  comment: string
) {
  return (
    !review ||
    review.enjoyment !== enjoyment ||
    review.difficulty !== difficulty ||
    review.workload !== workload ||
    review.value !== value ||
    review.comment !== comment
  );
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
      : (b?.comment ? 1 : 0) - (a?.comment ? 1 : 0);

  const sortByMostRecentReviewWithComment = (a?: Review, b?: Review) =>
    !!a?.comment === !!b?.comment
      ? sortByMostRecentReview(a, b)
      : (b?.comment ? 1 : 0) - (a?.comment ? 1 : 0);

  const sortByMostHelpfulWithComment = (a?: Review, b?: Review) =>
    !!a?.comment === !!b?.comment
      ? sortByMostHelpful(a, b)
      : (b?.comment ? 1 : 0) - (a?.comment ? 1 : 0);

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

export function getRatingTypeIconName(ratingType: RatingType) {
  const ratingTypeIconNameMap: Record<RatingType, string> = {
    [RatingType.enjoyment]: "heart",
    [RatingType.difficulty]: "stats-chart",
    [RatingType.workload]: "flame",
    [RatingType.value]: "trophy",
  };

  return ratingTypeIconNameMap[ratingType];
}

export function getRatingDescription(ratingType: RatingType, rating: Rating) {
  const ratingDescriptionMap: Record<RatingType, Record<Rating, string>> = {
    [RatingType.enjoyment]: {
      [5]: "Really Enjoyed (5/5)",
      [4]: "Somewhat Enjoyed (4/5)",
      [3]: "Neutral (3/5)",
      [2]: "Somewhat Disliked (2/5)",
      [1]: "Really Disliked (1/5)",
    },
    [RatingType.difficulty]: {
      [5]: "Really Difficult (5/5)",
      [4]: "Somewhat Difficult (4/5)",
      [3]: "Neutral (3/5)",
      [2]: "Somewhat Easy (2/5)",
      [1]: "Really Easy (1/5)",
    },
    [RatingType.workload]: {
      [5]: "Really Heavy (5/5)",
      [4]: "Somewhat Heavy (4/5)",
      [3]: "Neutral (3/5)",
      [2]: "Somewhat Light (2/5)",
      [1]: "Really Light (1/5)",
    },
    [RatingType.value]: {
      [5]: "Really Valuable (5/5)",
      [4]: "Somewhat Valuable (4/5)",
      [3]: "Neutral (3/5)",
      [2]: "Somewhat Useless (2/5)",
      [1]: "Really Useless (1/5)",
    },
  };

  return ratingDescriptionMap[ratingType]?.[rating];
}

export function Route<
  Tab extends keyof RootNavigationParamList,
  Screen extends RouteNameFor<Tab>,
  Params extends RouteParamsFor<Tab, Screen>
>(
  ...args: Params extends undefined
    ?
        | [Tab | undefined, Screen | undefined]
        | [Tab | undefined, Screen | undefined, undefined]
    : [Tab | undefined, Screen | undefined, Params]
) {
  const [tabName, screenName, screenParams] = args;
  return { tabName, screenName, screenParams };
}
