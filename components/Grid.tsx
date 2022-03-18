import { Children, type ReactNode, cloneElement } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import {
  Flex,
  type IFlexProps,
  Skeleton,
  type ISkeletonProps,
} from "native-base";

type GridProp = IFlexProps & {
  isLoaded?: boolean;
  skeletonCount?: number;
  skeletonProps?: ISkeletonProps;
  spacing?: number;
  minChildrenWidth: number;
  childrenHeight: number | string;
  children: ReactNode[];
};

export default function Grid({
  isLoaded = true,
  skeletonCount = 0,
  skeletonProps = { borderRadius: 12 },
  spacing = 5,
  minChildrenWidth: minChildWidth,
  childrenHeight: childHeight,
  children,
  ...rest
}: GridProp) {
  const acutalMargin = Math.max(spacing, 2);
  const actualChildWidth = Math.max(minChildWidth, 60);

  const insets = useSafeAreaInsets();
  const windowWidth = useWindowDimensions().width - insets.left - insets.right;

  const ratio =
    (windowWidth - acutalMargin * 2) / (actualChildWidth + acutalMargin * 2);
  const columns = Math.max(Math.floor(ratio), 1);

  const actualChildren = isLoaded
    ? children
    : [...Array(skeletonCount)].map((_, index) => (
        <Skeleton key={index} {...skeletonProps} />
      ));

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
      {Children.map(actualChildren, (child) =>
        cloneElement(child, {
          width:
            (windowWidth - acutalMargin * (columns + 1) * 2) / columns + "px",
          height: childHeight,
          margin: acutalMargin + "px",
        })
      )}
    </Flex>
  );
}
