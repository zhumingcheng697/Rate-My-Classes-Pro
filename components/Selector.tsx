import React, { useCallback, useMemo } from "react";
import { Select, type ISelectProps, Icon } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import { type Rating, type RatingType, ReviewOrder } from "../libs/types";
import { ratings, reviewOrders, getRatingDescription } from "../libs/utils";
import { useDimensions } from "../libs/hooks";
import Semester from "../libs/semester";
import colors from "../styling/colors";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";

type SelectorOptionRecord<T> = Record<string, T>;

type SelectorBaseProps<T> = {
  selectedOption?: T;
  options: T[];
  serializeOption?: (option: T) => string;
  onSelectedOptionChange: (option: T) => void;
};

export type SelectorProps<T> = SelectorBaseProps<T> &
  Omit<ISelectProps, keyof SelectorBaseProps<T>>;

export default function Selector<T>({
  selectedOption,
  options,
  serializeOption = (option) => `${option}`,
  onSelectedOptionChange,
  ...rest
}: SelectorProps<T>) {
  const dimension = useDimensions();
  const inset = useSafeAreaInsets();
  const optionRecord = useMemo(() => {
    const optionRecord: SelectorOptionRecord<T> = {};
    for (let option of options) {
      optionRecord[serializeOption(option)] = option;
    }
    return optionRecord;
  }, [serializeOption, options]);

  const selectOption = useCallback(
    (option: string) => (
      <Select.Item key={option} label={option} value={option} />
    ),
    []
  );

  return (
    <Select
      {...rest}
      selectedValue={
        selectedOption ? serializeOption(selectedOption) : undefined
      }
      onValueChange={(option) => onSelectedOptionChange(optionRecord[option])}
      dropdownIcon={
        <Icon
          size={"20px"}
          as={<Ionicons name={"chevron-down"} />}
          marginRight={"4px"}
        />
      }
      _actionSheetContent={{
        marginLeft: `${inset.left}px`,
        marginRight: `${inset.right}px`,
        width: `${dimension.width - inset.left - inset.right}px`,
      }}
      _selectedItem={{
        endIcon: (
          <Icon
            {...colorModeResponsiveStyle((selector) => ({
              color: selector(colors.nyu),
            }))}
            as={<Ionicons name={"checkmark"} />}
          />
        ),
      }}
    >
      {Object.keys(optionRecord).map(selectOption)}
    </Select>
  );
}

type RatingSelectorBaseProps = {
  selectedRating?: Rating;
  ratingType: RatingType;
  onSelectedRatingChange: (rating: Rating) => void;
};

export type RatingSelectorProps = RatingSelectorBaseProps &
  Omit<ISelectProps, keyof RatingSelectorBaseProps>;

export function RatingSelector({
  selectedRating,
  ratingType,
  onSelectedRatingChange,
  ...rest
}: RatingSelectorProps) {
  return (
    <Selector
      {...rest}
      selectedOption={selectedRating}
      options={ratings}
      serializeOption={(rating) => getRatingDescription(ratingType, rating)}
      onSelectedOptionChange={onSelectedRatingChange}
    />
  );
}

type ReviewOrderSelectorBaseProps = {
  selectedReviewOrder?: ReviewOrder;
  onSelectedReviewOrderChange: (reviewOrder: ReviewOrder) => void;
};

export type ReviewOrderSelectorProps = ReviewOrderSelectorBaseProps &
  Omit<ISelectProps, keyof ReviewOrderSelectorBaseProps>;

export function ReviewOrderSelector({
  selectedReviewOrder,
  onSelectedReviewOrderChange,
  ...rest
}: ReviewOrderSelectorProps) {
  return (
    <Selector
      {...rest}
      selectedOption={selectedReviewOrder}
      options={reviewOrders}
      onSelectedOptionChange={onSelectedReviewOrderChange}
    />
  );
}

type SemesterSelectorBaseProps = {
  selectedSemester?: Semester;
  semesterOptions: Semester[];
  onSelectedSemesterChange: (semester: Semester) => void;
};

export type SemesterSelectorProps = SemesterSelectorBaseProps &
  Omit<ISelectProps, keyof SemesterSelectorBaseProps>;

export function SemesterSelector({
  selectedSemester,
  semesterOptions,
  onSelectedSemesterChange,
  ...rest
}: SemesterSelectorProps) {
  return (
    <Selector
      {...rest}
      selectedOption={selectedSemester}
      options={semesterOptions}
      onSelectedOptionChange={onSelectedSemesterChange}
    />
  );
}
