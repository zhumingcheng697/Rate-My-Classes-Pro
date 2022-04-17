import React from "react";
import { HStack, type IStackProps, Text, VStack } from "native-base";
import { RatingType } from "../libs/types";

type RatingBlockProps = { ratingType: RatingType; rating: number };

function RatingBlock({ ratingType, rating }: RatingBlockProps) {
  return (
    <VStack
      justifyContent={"center"}
      background={"background.secondary"}
      paddingX={"20px"}
      paddingY={"5px"}
      margin={"5px"}
      borderRadius={10}
    >
      <Text fontSize={"md"} textAlign={"center"}>
        {ratingType}
      </Text>
      <Text fontSize={"2xl"} fontWeight={"medium"} textAlign={"center"}>
        {rating.toFixed(1)} / {(5).toFixed(1)}
      </Text>
    </VStack>
  );
}

type RatingDashboardBaseProps = {
  enjoyment: number;
  difficulty: number;
  workload: number;
  value: number;
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
