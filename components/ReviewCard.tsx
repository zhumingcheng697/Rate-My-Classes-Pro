import React, { useMemo, useState } from "react";
import {
  theme,
  HStack,
  Text,
  VStack,
  type IStackProps,
  IconButton,
  Icon,
  Button,
} from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import PlainTextButton from "./PlainTextButton";
import AlertPopup from "./AlertPopup";
import IconHStack from "./IconHStack";
import {
  RatingType,
  Vote,
  type Rating,
  type VoteRecord,
  type Review,
  type SharedNavigationParamList,
  type ClassCode,
  type ClassInfo,
} from "../libs/types";
import Semester from "../libs/semester";
import {
  getRatingDescription,
  getRatingTypeIconName,
  Route,
} from "../libs/utils";
import { useInitialTabName } from "../libs/hooks";
import { useAuth } from "../mongodb/auth";
import colors from "../styling/colors";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";

type ReviewCardNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Detail"
>;

type ReviewCardRouteProp = RouteProp<SharedNavigationParamList, "Detail">;

type RatingBlockProps = { ratingType: RatingType; rating: Rating };

function RatingBlock({ ratingType, rating }: RatingBlockProps) {
  return (
    <IconHStack iconName={getRatingTypeIconName(ratingType)}>
      <HStack flexShrink={1} flexGrow={1}>
        <Text
          fontSize={"md"}
          fontWeight={"medium"}
          lineHeight={"sm"}
        >{`${ratingType}: `}</Text>
        <Text fontSize={"md"} lineHeight={"sm"}>
          {getRatingDescription(ratingType, rating)}
        </Text>
      </HStack>
    </IconHStack>
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
  const { user, isAuthenticated, db } = useAuth();
  const voteCount = useMemo(
    () => Object.keys(upvotes).length - Object.keys(downvotes).length,
    [upvotes, downvotes]
  );

  const vote = useMemo(() => {
    if (!user || !isAuthenticated) {
      return undefined;
    }
    if (upvotes[user.id]) {
      return Vote.upvote;
    } else if (downvotes[user.id]) {
      return Vote.downvote;
    }
  }, [upvotes, downvotes, isAuthenticated]);

  const upvote = async () =>
    await db?.voteReview(classCode, userId, Vote.upvote);

  const downvote = async () =>
    await db?.voteReview(classCode, userId, Vote.downvote);

  const unvote = async () => await db?.voteReview(classCode, userId);

  return (
    <>
      <AlertPopup
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        header={isAuthenticated ? "Unable to Vote" : "Sign In to Vote"}
        body={
          isAuthenticated
            ? undefined
            : "You need to sign in to vote others’ reviews."
        }
        footerPrimaryButton={
          !isAuthenticated ? (
            <Button
              onPress={() => {
                setShowAlert(false);
                navigation.navigate("SignInSignUp", { classCode });
              }}
            >
              Sign In
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
              {...colorModeResponsiveStyle((selector) => ({
                color: selector(
                  vote === Vote.upvote
                    ? colors.nyu
                    : {
                        light: theme.colors.gray[400],
                        dark: theme.colors.gray[700],
                      }
                ),
              }))}
              as={<Ionicons name={"caret-up"} />}
            />
          }
          onPress={async () => {
            if (user && isAuthenticated) {
              if (vote === Vote.upvote) {
                try {
                  await unvote();

                  const newUpvotes = { ...upvotes };
                  delete newUpvotes[user.id];
                  setVotes(newUpvotes);
                } catch (e) {
                  setShowAlert(true);
                }
              } else {
                try {
                  await upvote();

                  const newUpvotes = { ...upvotes };
                  newUpvotes[user.id] = true;

                  if (vote === Vote.downvote) {
                    const newDownvotes = { ...downvotes };
                    delete newDownvotes[user.id];
                    setVotes(newUpvotes, newDownvotes);
                    return;
                  }

                  setVotes(newUpvotes);
                } catch (e) {
                  setShowAlert(true);
                }
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
              {...colorModeResponsiveStyle((selector) => ({
                color: selector(
                  vote === Vote.downvote
                    ? colors.nyu
                    : {
                        light: theme.colors.gray[400],
                        dark: theme.colors.gray[700],
                      }
                ),
              }))}
              as={<Ionicons name={"caret-down"} />}
            />
          }
          onPress={async () => {
            if (user && isAuthenticated) {
              if (vote === Vote.downvote) {
                try {
                  await unvote();

                  const newDownvotes = { ...downvotes };
                  delete newDownvotes[user.id];
                  setVotes(undefined, newDownvotes);
                } catch (e) {
                  setShowAlert(true);
                }
              } else {
                try {
                  await downvote();

                  const newDownvotes = { ...downvotes };
                  newDownvotes[user.id] = true;

                  if (vote === Vote.upvote) {
                    const newUpvotes = { ...upvotes };
                    delete newUpvotes[user.id];
                    setVotes(newUpvotes, newDownvotes);
                    return;
                  }

                  setVotes(undefined, newDownvotes);
                } catch (e) {
                  setShowAlert(true);
                }
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
  classInfo?: ClassInfo;
  review: Review;
  setReview: (review: Review) => void;
};

export type ReviewCardProps = ReviewCardBaseProps &
  Omit<IStackProps, keyof ReviewCardBaseProps>;

export default function ReviewCard({
  classInfo,
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
  const route = useRoute<ReviewCardRouteProp>();
  const { classCode } = route.params;
  const { user, isAuthenticated } = useAuth();

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

  const tabName = useInitialTabName();

  return (
    <VStack
      borderRadius={10}
      space={"5px"}
      padding={"10px"}
      {...colorModeResponsiveStyle((selector) => ({
        background: selector(colors.background.secondary),
      }))}
      {...rest}
    >
      <Text fontSize={"lg"} fontWeight={"semibold"}>{`${new Semester(
        semester
      ).toString()} with ${instructor}`}</Text>
      <VStack space={"3px"} marginBottom={"2px"}>
        <RatingBlock ratingType={RatingType.enjoyment} rating={enjoyment} />
        <RatingBlock ratingType={RatingType.difficulty} rating={difficulty} />
        <RatingBlock ratingType={RatingType.workload} rating={workload} />
        <RatingBlock ratingType={RatingType.value} rating={value} />
      </VStack>
      {!!comment && <Text fontSize={"md"}>{comment}</Text>}
      <HStack justifyContent={"space-between"} flexWrap={"wrap"}>
        <VoteBlock
          classCode={classCode}
          margin={"-6px"}
          userId={userId}
          upvotes={upvotes}
          downvotes={downvotes}
          setVotes={setVotes}
        />
        {isAuthenticated && user?.id === userId && (
          <PlainTextButton
            paddingX={"5px"}
            title={"Edit My Review"}
            linkTo={Route(tabName, "Review", {
              classCode: classInfo ?? classCode,
              previousReview: review,
              newOrEdit: "Edit",
            })}
          />
        )}
        <Text>
          {new Date(reviewedDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </HStack>
    </VStack>
  );
}
