import React, { useCallback, useMemo, type ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Box,
  Flex,
  type IFlexProps,
  Skeleton,
  type ISkeletonProps,
} from "native-base";

import { useDimensions } from "../libs/hooks";

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
  childrenCount: number;
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
  childrenCount,
  ...rest
}: GridProps) {
  const { left, right } = useSafeAreaInsets();
  const { width } = useDimensions();
  const heightProps = useMemo(
    () => ({
      height: childHeight,
      minHeight:
        !childHeight && !minChildHeight && !maxChildHeight
          ? "90px"
          : minChildHeight,
      maxHeight: maxChildHeight,
    }),
    [childHeight, minChildHeight, maxChildHeight]
  );

  const { columns, containerMarginX, renderItemInfo } = useMemo(() => {
    const acutalMargin = Math.max(spacing, 2);
    const actualChildWidth = Math.max(minChildWidth, 60);

    const realWindowWidth = width - left - right;
    const roundedWindowWidth = Math.floor(realWindowWidth / 4) * 4;
    const ratio =
      (roundedWindowWidth - acutalMargin * 2) /
      (actualChildWidth + acutalMargin * 2);
    const columns = Math.max(Math.floor(ratio), 1);

    const containerMarginX = `${
      acutalMargin +
      Math.floor(Math.max(realWindowWidth - roundedWindowWidth - 1, 0) / 2)
    }px`;

    const renderItemInfo = {
      width: `${
        (roundedWindowWidth - acutalMargin * (columns + 1) * 2) / columns
      }px`,
      margin: `${acutalMargin}px`,
      ...heightProps,
    };

    return { columns, containerMarginX, renderItemInfo };
  }, [spacing, minChildWidth, width, left, right, heightProps]);

  const skeletonChildren = useCallback(
    (info: GridRenderItemInfo) => {
      const skeleton = (_: any, index: number) => (
        <Skeleton
          key={"skeleton" + index}
          {...info}
          {...Object.assign({ borderRadius: 10 }, skeletonProps)}
        />
      );
      return [...Array(Math.ceil(skeletonCount / columns) * columns)].map(
        skeleton
      );
    },
    [skeletonCount, skeletonProps]
  );

  const placeholderChildren = useCallback(
    (info: GridRenderItemInfo) => {
      const placeholder = (_: any, index: number) => (
        <Box key={"placeholder" + index} {...info} />
      );
      return [
        [...Array((columns - (childrenCount % columns)) % columns)].map(
          placeholder
        ),
      ];
    },
    [childrenCount, columns]
  );

  return (
    <Flex
      {...rest}
      flexDirection={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      alignContent={"center"}
      flexWrap={"wrap"}
      marginX={containerMarginX}
    >
      {(isLoaded ? children : skeletonChildren)(renderItemInfo)}
      {isLoaded && placeholderChildren(renderItemInfo)}
    </Flex>
  );
}
