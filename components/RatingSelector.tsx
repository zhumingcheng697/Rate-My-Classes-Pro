import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Select, type ISelectProps, Icon } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  getDifficultyDescription,
  getEnjoymentDescription,
  getValueDescription,
  getWorkloadDescription,
  Rating,
  RatingType,
  ratings,
} from "../libs/rating";

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
  const inset = useSafeAreaInsets();
  const dimension = useWindowDimensions();
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
      _actionSheetContent={{
        marginLeft: `${inset.left}px`,
        marginRight: `${inset.right}px`,
        width: `${dimension.width - inset.left - inset.right}px`,
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
