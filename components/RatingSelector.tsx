import React, { useMemo } from "react";
import { Select, type ISelectProps, Icon } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import { type Rating, type RatingType } from "../libs/types";
import { ratings, ratingDescriptionMap } from "../libs/utils";
import useDimensions from "../libs/useDimensions";

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
  const dimension = useDimensions();
  const inset = useSafeAreaInsets();
  const ratingOptionsRecord = useMemo(() => {
    const ratingOptionsRecord: RatingOptionRecord = {};
    for (let rating of ratings) {
      ratingOptionsRecord[ratingDescriptionMap[ratingType][rating]] = rating;
    }
    return ratingOptionsRecord;
  }, [ratingType]);

  return (
    <Select
      {...rest}
      selectedValue={
        selectedRating
          ? ratingDescriptionMap[ratingType][selectedRating]
          : undefined
      }
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
