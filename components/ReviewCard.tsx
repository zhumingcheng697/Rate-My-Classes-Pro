import React, { useMemo, useState } from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  type IStackProps,
  IconButton,
  Icon,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  type Rating,
  RatingType,
  type Review,
  VoteRecord,
  Vote,
} from "../libs/types";
import PlainTextButton from "./PlainTextButton";
import Semester from "../libs/semester";
import { useAuth } from "../mongodb/auth";

type RatingBlockProps = { ratingType: RatingType; rating: Rating };

function RatingBlock({ ratingType, rating }: RatingBlockProps) {
  return (
    <HStack>
      <Text fontSize={"md"} fontWeight={"medium"}>{`${ratingType}: `}</Text>
      <Text fontSize={"md"}>{rating} / 5</Text>
    </HStack>
  );
}

type ReviewCardBaseProps = {
  review: Review;
  setReview: (review: Review) => void;
};

export type ReviewCardProps = ReviewCardBaseProps &
  Omit<IStackProps, keyof ReviewCardBaseProps>;

export default function ReviewCard({ review, ...rest }: ReviewCardProps) {
  const {
    instructor,
    semester,
    enjoyment,
    difficulty,
    workload,
    value,
    upvotes,
    downvotes,
    reviewedDate,
    comment,
  } = review;

  return (
    <VStack
      {...rest}
      background={"background.secondary"}
      borderRadius={10}
      space={"5px"}
      padding={"10px"}
    >
      <Text fontSize={"lg"} fontWeight={"semibold"}>{`${new Semester(
        semester
      ).toString()} with ${instructor}`}</Text>
      <HStack flexWrap={"wrap"}>
        <RatingBlock ratingType={RatingType.enjoyment} rating={enjoyment} />
        <Box minWidth={"25px"} />
        <RatingBlock ratingType={RatingType.difficulty} rating={difficulty} />
        <Box minWidth={"25px"} />
        <RatingBlock ratingType={RatingType.workload} rating={workload} />
        <Box minWidth={"25px"} />
        <RatingBlock ratingType={RatingType.value} rating={value} />
      </HStack>
      {comment && <Text fontSize={"md"}>{comment}</Text>}
      <HStack justifyContent={"space-between"} flexWrap={"wrap"}>
        <PlainTextButton
          title={"Edit My Review"}
          _text={{ fontWeight: "semibold" }}
        />
        <HStack>
          <IconButton
            variant={"unstyled"}
            padding={"3px"}
            icon={
              <Icon
                size={"22px"}
                color={"gray.400"}
                as={<Ionicons name={"caret-up"} />}
              />
            }
            // onPress={}
          />
          <Text fontWeight={"semibold"}>51</Text>
          <IconButton
            variant={"unstyled"}
            padding={"3px"}
            icon={
              <Icon
                size={"22px"}
                color={"gray.400"}
                as={<Ionicons name={"caret-down"} />}
              />
            }
            // onPress={}
          />
        </HStack>
        <Text>
          {new Date(reviewedDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </HStack>
    </VStack>
  );
}
