export type Rating = 1 | 2 | 3 | 4 | 5;

export const ratings: Rating[] = [5, 4, 3, 2, 1];

export function getEnjoymentDescription(rating: Rating) {
  return {
    [5]: "Really Enjoyed",
    [4]: "Somewhat Enjoyed",
    [3]: "Neutral",
    [2]: "Somewhat Disliked",
    [1]: "Really Disliked",
  }[rating];
}

export function getDifficultyDescription(rating: Rating) {
  return {
    [5]: "Really Difficult",
    [4]: "Somewhat Difficult",
    [3]: "Neutral",
    [2]: "Somewhat Easy",
    [1]: "Really Easy",
  }[rating];
}

export function getWorkloadDescription(rating: Rating) {
  return {
    [5]: "Really Heavy",
    [4]: "Somewhat Heavy",
    [3]: "Neutral",
    [2]: "Somewhat Light",
    [1]: "Really Light",
  }[rating];
}

export function getValueDescription(rating: Rating) {
  return {
    [5]: "Really Valuable",
    [4]: "Somewhat Valuable",
    [3]: "Neutral",
    [2]: "Somewhat Useless",
    [1]: "Really Useless",
  }[rating];
}
