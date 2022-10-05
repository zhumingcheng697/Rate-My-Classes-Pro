import React from "react";
import { HStack, type IStackProps, Text, VStack } from "native-base";

import IconHStack from "./IconHStack";
import { RatingType } from "../libs/types";
import { ratingTypeIconNameMap } from "../libs/utils";
import colors from "../styling/colors";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";

type RatingBlockProps = { ratingType: RatingType; rating: number | null };

function RatingBlock({ ratingType, rating }: RatingBlockProps) {
  return (
    <VStack
      justifyContent={"center"}
      alignItems={"center"}
      paddingX={"20px"}
      paddingY={"8px"}
      minWidth={"140px"}
      margin={"5px"}
      space={"2px"}
      borderRadius={10}
      {...colorModeResponsiveStyle((selector) => ({
        background: selector(colors.background.secondary),
      }))}
    >
      <IconHStack iconName={ratingTypeIconNameMap[ratingType]}>
        <Text
          fontSize={"md"}
          fontWeight={"semibold"}
          lineHeight={"sm"}
          textAlign={"center"}
        >
          {ratingType}
        </Text>
      </IconHStack>
      <Text
        fontSize={"2xl"}
        textAlign={"center"}
        opacity={rating === null ? 0.5 : 1}
      >
        {rating === null
          ? "Loading"
          : isNaN(rating)
          ? "N/A"
          : `${rating.toFixed(1)} / ${(5).toFixed(1)}`}
      </Text>
    </VStack>
  );
}

type RatingDashboardBaseProps = {
  enjoyment: number | null;
  difficulty: number | null;
  workload: number | null;
  value: number | null;
};

export type RatingDashboardProps = RatingDashboardBaseProps &
  Omit<IStackProps, keyof RatingDashboardBaseProps>;

export default function RatingDashboard({
  enjoyment,
  difficulty,
  workload,
  value,
  ...rest
}: RatingDashboardProps) {
  return (
    <HStack {...rest} justifyContent={"center"} flexWrap={"wrap"}>
      <RatingBlock ratingType={RatingType.enjoyment} rating={enjoyment} />
      <RatingBlock ratingType={RatingType.difficulty} rating={difficulty} />
      <RatingBlock ratingType={RatingType.workload} rating={workload} />
      <RatingBlock ratingType={RatingType.value} rating={value} />
    </HStack>
  );
}
