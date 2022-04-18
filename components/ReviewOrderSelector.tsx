import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Select, type ISelectProps, Icon } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import { ReviewOrder } from "../libs/types";
import { reviewOrders } from "../libs/utils";

type ReviewOrderOptionRecord = Record<string, ReviewOrder>;

type ReviewOrderSelectorBaseProps = {
  selectedReviewOrder?: ReviewOrder;
  onSelectedReviewOrderChange: (reviewOrder: ReviewOrder) => void;
};

export type ReviewOrderSelectorProps = ReviewOrderSelectorBaseProps &
  Omit<ISelectProps, keyof ReviewOrderSelectorBaseProps>;

export default function ReviewOrderSelector({
  selectedReviewOrder,
  onSelectedReviewOrderChange,
  ...rest
}: ReviewOrderSelectorProps) {
  const inset = useSafeAreaInsets();
  const dimension = useWindowDimensions();
  const reviewOrderOptionsRecord = useMemo(() => {
    const reviewOrderOptionsRecord: ReviewOrderOptionRecord = {};
    for (let reviewOrder of reviewOrders) {
      reviewOrderOptionsRecord[reviewOrder] = reviewOrder;
    }
    return reviewOrderOptionsRecord;
  }, []);

  return (
    <Select
      {...rest}
      selectedValue={selectedReviewOrder}
      onValueChange={(reviewOrder) => {
        onSelectedReviewOrderChange(reviewOrderOptionsRecord[reviewOrder]);
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
      {Object.keys(reviewOrderOptionsRecord).map((reviewOrder) => (
        <Select.Item
          key={reviewOrder}
          label={reviewOrder}
          value={reviewOrder}
        />
      ))}
    </Select>
  );
}
