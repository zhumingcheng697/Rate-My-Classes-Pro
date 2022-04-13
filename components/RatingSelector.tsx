import React, { useMemo } from "react";
import { Select, type ISelectProps, Icon } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  getDifficultyDescription,
  getEnjoymentDescription,
  getValueDescription,
  getWorkloadDescription,
  Rating,
  ratings,
} from "../libs/rating";

export enum RatingType {
  enjoyment = "ENJOYMENT",
  difficulty = "DIFFICULTY",
  workload = "WORKLOAD",
  value = "VALUE",
}

type RatingOptionRecord = Record<string, Rating>;

type RatingSelectorBaseProps = {
  selectedRating?: Rating;
  ratingType: RatingType;
  onSelectedRatingChange: (rating: Rating) => void;
};

export type RatingSelectorProps = RatingSelectorBaseProps &
  Omit<ISelectProps, keyof RatingSelectorBaseProps>;

export default function RatingSelector({
  selectedRating,
  ratingType,
  onSelectedRatingChange,
  ...rest
}: RatingSelectorProps) {
  const { descriptor, ratingOptionsRecord } = useMemo(() => {
    const descriptor = {
      [RatingType.enjoyment]: getEnjoymentDescription,
      [RatingType.difficulty]: getDifficultyDescription,
      [RatingType.workload]: getWorkloadDescription,
      [RatingType.value]: getValueDescription,
    }[ratingType];

    const ratingOptionsRecord: RatingOptionRecord = {};
    for (let semester of ratings) {
      ratingOptionsRecord[descriptor(semester)] = semester;
    }
    return { descriptor, ratingOptionsRecord };
  }, [ratingType]);

  return (
    <Select
      {...rest}
      selectedValue={selectedRating ? descriptor(selectedRating) : undefined}
      onValueChange={(rating) => {
        onSelectedRatingChange(ratingOptionsRecord[rating]);
      }}
      _selectedItem={{
        endIcon: <Icon color={"nyu"} as={<Ionicons name={"checkmark"} />} />,
      }}
    >
      {Object.keys(ratingOptionsRecord).map((rating) => (
        <Select.Item key={rating} label={rating} value={rating} />
      ))}
    </Select>
  );
}
