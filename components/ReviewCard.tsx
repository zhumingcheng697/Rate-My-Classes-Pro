import React, { useMemo, useState } from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  type IStackProps,
  IconButton,
  Icon,
  Button,
} from "native-base";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  type Rating,
  RatingType,
  type Review,
  VoteRecord,
  Vote,
  SharedNavigationParamList,
  ClassCode,
} from "../libs/types";
import Semester from "../libs/semester";
import PlainTextButton from "./PlainTextButton";
import AlertPopup from "./AlertPopup";
import { useAuth } from "../mongodb/auth";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { useDB } from "../mongodb/db";

type ReviewCardNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Detail"
>;

type ReviewCardRouteProp = RouteProp<SharedNavigationParamList, "Detail">;

type RatingBlockProps = { ratingType: RatingType; rating: Rating };

function RatingBlock({ ratingType, rating }: RatingBlockProps) {
  return (
    <HStack>
      <Text fontSize={"md"} fontWeight={"medium"}>{`${ratingType}: `}</Text>
      <Text fontSize={"md"}>{rating} / 5</Text>
    </HStack>
  );
}

type VoteBlockBaseProps = {
  userId: string;
  classCode: ClassCode;
  upvotes: VoteRecord;
  downvotes: VoteRecord;
  setVotes: (upVotes?: VoteRecord, downvotes?: VoteRecord) => void;
};

type VoteBlockProps = VoteBlockBaseProps &
  Omit<IStackProps, keyof VoteBlockBaseProps>;

function VoteBlock({
  userId,
  classCode,
  upvotes,
  downvotes,
  setVotes,
  ...rest
}: VoteBlockProps) {
  const navigation = useNavigation<ReviewCardNavigationProp>();
  const [showAlert, setShowAlert] = useState(false);
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated;
  const voteCount = useMemo(
    () => Object.keys(upvotes).length - Object.keys(downvotes).length,
    [upvotes, downvotes]
  );
  const db = useMemo(() => {
    if (auth.user && auth.isAuthenticated) return useDB(auth.user);
  }, [auth.user]);

  const vote = useMemo(() => {
    if (!auth.user || !isAuthenticated) {
      return undefined;
    }
    if (upvotes[auth.user.id]) {
      return Vote.upvote;
    } else if (downvotes[auth.user.id]) {
      return Vote.downvote;
    }
  }, [upvotes, downvotes, isAuthenticated]);

  const upvote = () => {
    db?.voteReview(classCode, userId, Vote.upvote);
  };

  const downvote = () => {
    db?.voteReview(classCode, userId, Vote.downvote);
  };

  const unvote = () => {
    db?.voteReview(classCode, userId);
  };

  return (
    <>
      <AlertPopup
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        header={isAuthenticated ? "???" : "Sign Up to Vote"}
        body={
          isAuthenticated
            ? "???"
            : "You need an account to vote others’ reviews."
        }
        footerPrimaryButton={
          !isAuthenticated ? (
            <Button
              onPress={() => {
                setShowAlert(false);
                navigation.navigate("SignInSignUp");
              }}
            >
              Sign Up
            </Button>
          ) : undefined
        }
      />
      <HStack alignItems={"center"} {...rest}>
        <IconButton
          variant={"unstyled"}
          padding={"3px"}
          icon={
            <Icon
              size={"22px"}
              color={vote === Vote.upvote ? "nyu" : undefined}
              as={<Ionicons name={"caret-up"} />}
            />
          }
          onPress={() => {
            if (auth.user && isAuthenticated) {
              if (vote === Vote.upvote) {
                console.log(`unvote ${userId}`);
                unvote();

                const newUpvotes = { ...upvotes };
                delete newUpvotes[auth.user.id];
                setVotes(newUpvotes);
              } else {
                console.log(`upvote ${userId}`);
                upvote();

                const newUpvotes = { ...upvotes };
                newUpvotes[auth.user.id] = true;

                if (vote === Vote.downvote) {
                  const newDownvotes = { ...upvotes };
                  delete newDownvotes[auth.user.id];
                  setVotes(newUpvotes, newDownvotes);
                  return;
                }

                setVotes(newUpvotes);
              }
            } else {
              setShowAlert(true);
            }
          }}
        />
        <Text fontWeight={"semibold"}>{voteCount}</Text>
        <IconButton
          variant={"unstyled"}
          padding={"3px"}
          icon={
            <Icon
              size={"22px"}
              color={vote === Vote.downvote ? "nyu" : undefined}
              as={<Ionicons name={"caret-down"} />}
            />
          }
          onPress={() => {
            if (auth.user && isAuthenticated) {
              if (vote === Vote.downvote) {
                unvote();
                console.log(`unvote ${userId}`);

                const newDownvotes = { ...upvotes };
                delete newDownvotes[auth.user.id];
                setVotes(undefined, newDownvotes);
              } else {
                downvote();
                console.log(`downvote ${userId}`);

                const newDownvotes = { ...upvotes };
                newDownvotes[auth.user.id] = true;

                if (vote === Vote.upvote) {
                  const newUpvotes = { ...upvotes };
                  delete newUpvotes[auth.user.id];
                  setVotes(newUpvotes, newDownvotes);
                  return;
                }

                setVotes(undefined, newDownvotes);
              }
            } else {
              setShowAlert(true);
            }
          }}
        />
      </HStack>
    </>
  );
}

type ReviewCardBaseProps = {
  classCode: ClassCode;
  review: Review;
  setReview: (review: Review) => void;
};

export type ReviewCardProps = ReviewCardBaseProps &
  Omit<IStackProps, keyof ReviewCardBaseProps>;

export default function ReviewCard({
  classCode,
  review,
  setReview,
  ...rest
}: ReviewCardProps) {
  const {
    userId,
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

  const navigation = useNavigation<ReviewCardNavigationProp>();
  const route = useRoute<ReviewCardRouteProp>();
  const { classInfo } = route.params;
  const auth = useAuth();

  const setVotes = (newUpvotes?: VoteRecord, newDownvotes?: VoteRecord) => {
    const newReview = { ...review };
    if (newUpvotes) {
      newReview.upvotes = newUpvotes;
    }
    if (newDownvotes) {
      newReview.downvotes = newDownvotes;
    }
    setReview(newReview);
  };

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
        <VoteBlock
          classCode={classCode}
          margin={"-3px"}
          userId={userId}
          upvotes={upvotes}
          downvotes={downvotes}
          setVotes={setVotes}
        />
        {auth.isAuthenticated && auth.user?.id === userId && (
          <PlainTextButton
            title={"Edit"}
            _text={{ fontWeight: "semibold" }}
            onPress={() => {
              navigation.navigate("Review", {
                classInfo,
                previousReview: review,
              });
            }}
          />
        )}
        <Text>
          {new Date(reviewedDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
          })}
        </Text>
      </HStack>
    </VStack>
  );
}
