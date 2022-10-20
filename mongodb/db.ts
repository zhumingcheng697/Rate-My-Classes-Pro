import type Realm from "./Realm";
import {
  MONGODB_SERVICE_NAME,
  MONGODB_DATABASE_NAME,
} from "react-native-dotenv";

import { type UserDoc, type ReviewDoc, Collections } from "./types";
import {
  type ClassCode,
  type StarredClassInfo,
  type ReviewedClassInfo,
  type Review,
  Vote,
  type Settings,
} from "../libs/types";
import { getFullClassCode } from "../libs/utils";

export type Database = ReturnType<typeof Database>;

export function Database(user: Realm.User) {
  const db = user.mongoClient(MONGODB_SERVICE_NAME).db(MONGODB_DATABASE_NAME);

  const isAuthenticated = user.id && user.providerType !== "anon-user";

  type UpdateOneParams = Parameters<
    ReturnType<typeof db.collection>["updateOne"]
  >;
  type Update = UpdateOneParams[1];
  type UpdateOptions = UpdateOneParams[2];

  async function createUserDoc(username: string, settings: Settings) {
    if (!isAuthenticated) return;

    const result = await db.collection<UserDoc>(Collections.users).updateOne(
      { _id: user.id },
      {
        $setOnInsert: {
          username,
          starredClasses: {},
          reviewedClasses: {},
          settings,
        },
      },
      { upsert: true }
    );

    return !!result.upsertedId;
  }

  async function loadUserDoc() {
    if (!isAuthenticated) return;

    return await db
      .collection<UserDoc>(Collections.users)
      .findOne({ _id: user.id });
  }

  async function updateUserDoc(update: Update) {
    if (!isAuthenticated) return;

    await db
      .collection<UserDoc>(Collections.users)
      .updateOne({ _id: user.id }, update);
  }

  async function updateUsername(username: string) {
    await updateUserDoc({ $set: { username } });
  }

  async function updateSettings(settings: Settings) {
    await updateUserDoc({ $set: { settings } });
  }

  async function starClass(starredClass: StarredClassInfo) {
    await updateUserDoc({
      $set: {
        [`starredClasses.${getFullClassCode(starredClass)}`]: starredClass,
      },
    });
  }

  async function unstarClass(classCode: ClassCode) {
    await updateUserDoc({
      $unset: {
        [`starredClasses.${getFullClassCode(classCode)}`]: null,
      },
    });
  }

  async function reviewClass(reviewedClass: ReviewedClassInfo) {
    await updateUserDoc({
      $set: {
        [`reviewedClasses.${getFullClassCode(reviewedClass)}`]: reviewedClass,
      },
    });
  }

  async function unreviewClass(classCode: ClassCode) {
    await updateUserDoc({
      $unset: {
        [`reviewedClasses.${getFullClassCode(classCode)}`]: null,
      },
    });
  }

  async function loadReviewDoc(classCode: ClassCode) {
    return await db
      .collection<ReviewDoc>(Collections.reviews)
      .findOne({ _id: getFullClassCode(classCode) });
  }

  async function updateReviewDoc(
    classCode: ClassCode,
    update: Update,
    options?: UpdateOptions
  ) {
    if (!isAuthenticated) return;

    await db
      .collection<ReviewDoc>(Collections.reviews)
      .updateOne({ _id: getFullClassCode(classCode) }, update, options);
  }

  async function submitReview(classCode: ClassCode, review: Review) {
    await updateReviewDoc(
      classCode,
      {
        $set: {
          [`${[user.id]}.enjoyment`]: review.enjoyment,
          [`${[user.id]}.difficulty`]: review.difficulty,
          [`${[user.id]}.workload`]: review.workload,
          [`${[user.id]}.value`]: review.value,
          [`${[user.id]}.comment`]: review.comment,
          [`${[user.id]}.userId`]: review.userId,
          [`${[user.id]}.upvotes`]: review.upvotes,
          [`${[user.id]}.downvotes`]: review.downvotes,
          [`${[user.id]}.reviewedDate`]: review.reviewedDate,
          [`${[user.id]}.semester`]: review.semester,
          [`${[user.id]}.instructor`]: review.instructor,
        },
      },
      { upsert: true }
    );
  }

  async function updateReview(classCode: ClassCode, review: Review) {
    await updateReviewDoc(classCode, {
      $set: {
        [`${[user.id]}.enjoyment`]: review.enjoyment,
        [`${[user.id]}.difficulty`]: review.difficulty,
        [`${[user.id]}.workload`]: review.workload,
        [`${[user.id]}.value`]: review.value,
        [`${[user.id]}.comment`]: review.comment,
      },
    });
  }

  async function voteReview(classCode: ClassCode, userId: string, vote?: Vote) {
    let update: Update;

    if (vote === Vote.upvote) {
      update = {
        $set: {
          [`${[userId]}.upvotes.${user.id}`]: true,
        },
        $unset: {
          [`${[userId]}.downvotes.${user.id}`]: null,
        },
      };
    } else if (vote === Vote.downvote) {
      update = {
        $set: {
          [`${[userId]}.downvotes.${user.id}`]: true,
        },
        $unset: {
          [`${[userId]}.upvotes.${user.id}`]: null,
        },
      };
    } else {
      update = {
        $unset: {
          [`${[userId]}.upvotes.${user.id}`]: null,
          [`${[userId]}.downvotes.${user.id}`]: null,
        },
      };
    }

    await updateReviewDoc(classCode, update);
  }

  async function deleteReview(classCode: ClassCode) {
    await updateReviewDoc(classCode, {
      $unset: {
        [`${[user.id]}`]: null,
      },
    });
  }

  return {
    createUserDoc,
    loadUserDoc,
    updateUsername,
    updateSettings,
    starClass,
    unstarClass,
    reviewClass,
    unreviewClass,
    loadReviewDoc,
    submitReview,
    updateReview,
    voteReview,
    deleteReview,
  };
}
