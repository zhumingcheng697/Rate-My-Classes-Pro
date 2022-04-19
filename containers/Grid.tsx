import React, { useCallback, type ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import {
  Flex,
  type IFlexProps,
  Skeleton,
  type ISkeletonProps,
} from "native-base";

export type GridRenderItemInfo = {
  width: string;
  margin: string;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
};

type GridBaseProps = {
  isLoaded?: boolean;
  skeletonCount?: number;
  skeletonProps?: ISkeletonProps;
  spacing?: number;
  minChildWidth?: number;
  childHeight?: number | string;
  minChildHeight?: number | string;
  maxChildHeight?: string | number;
  children: (info: GridRenderItemInfo) => ReactNode;
};

export type GridProps = GridBaseProps & Omit<IFlexProps, keyof GridBaseProps>;

export default function Grid({
  isLoaded = true,
  skeletonCount = 12,
  skeletonProps,
  spacing = 5,
  minChildWidth = 165,
  childHeight,
  minChildHeight,
  maxChildHeight,
  children,
  ...rest
}: GridProps) {
  skeletonProps = Object.assign({ borderRadius: 10 }, skeletonProps);

  const acutalMargin = Math.max(spacing, 2);
  const actualChildWidth = Math.max(minChildWidth, 60);

  const insets = useSafeAreaInsets();
  const windowWidth = useWindowDimensions().width - insets.left - insets.right;

  const ratio =
    (windowWidth - acutalMargin * 2) / (actualChildWidth + acutalMargin * 2);
  const columns = Math.max(Math.floor(ratio), 1);

  const skeletonChildren = useCallback(
    (info: GridRenderItemInfo) =>
      [...Array(skeletonCount)].map((_, index) => (
        <Skeleton key={index} {...info} {...skeletonProps} />
      )),
    [skeletonCount, skeletonProps]
  );

  const heightProps = {
    height: childHeight,
    minHeight:
      !childHeight && !minChildHeight && !maxChildHeight
        ? "90px"
        : minChildHeight,
    maxHeight: maxChildHeight,
  };

  return (
    <Flex
      {...rest}
      flexDirection={"row"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      alignContent={"center"}
      flexWrap={"wrap"}
      marginX={acutalMargin + "px"}
    >
      {(isLoaded ? children : skeletonChildren)({
        width:
          Math.floor(
            (windowWidth - acutalMargin * (columns + 1) * 2) / columns
          ) + "px",
        margin: acutalMargin + "px",
        ...heightProps,
      })}
    </Flex>
  );
}
