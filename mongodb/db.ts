import Realm, { type User } from "realm";

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

const servieName = "mongodb-atlas";
const dbName = "RateMyClassesPro";

export function useDB(user: User) {
  const db = user.mongoClient(servieName).db(dbName);

  const isAuthenticated = user.id && user.providerType !== "anon-user";

  async function createUserDoc(username: string, settings: Settings) {
    if (!isAuthenticated) return;

    await db.collection<UserDoc>(Collections.users).insertOne({
      _id: user.id,
      username,
      starredClasses: {},
      reviewedClasses: {},
      settings,
    });
  }

  async function loadUserDoc() {
    if (!isAuthenticated) return;

    return await db
      .collection<UserDoc>(Collections.users)
      .findOne({ _id: user.id });
  }

  async function updateUserDoc(update: Realm.Services.MongoDB.Update) {
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
    update: Realm.Services.MongoDB.Update,
    options?: Realm.Services.MongoDB.UpdateOptions
  ) {
    if (!isAuthenticated) return;

    await db
      .collection<ReviewDoc>(Collections.reviews)
      .updateOne({ _id: getFullClassCode(classCode) }, update, options);
  }

  async function upsertReview(classCode: ClassCode, review: Review) {
    await updateReviewDoc(
      classCode,
      {
        $set: {
          [`${[user.id]}.enjoyment`]: review.enjoyment,
          [`${[user.id]}.difficulty`]: review.difficulty,
          [`${[user.id]}.workload`]: review.workload,
          [`${[user.id]}.value`]: review.value,
          [`${[user.id]}.comment`]: review.comment,
        },
        $setOnInsert: {
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

  async function voteReview(classCode: ClassCode, review: Review, vote?: Vote) {
    let update: Realm.Services.MongoDB.Update;

    if (vote === Vote.upvote) {
      update = {
        $set: {
          [`${[review.userId]}.upvotes.${user.id}`]: true,
        },
        $unset: {
          [`${[review.userId]}.downvotes.${user.id}`]: null,
        },
      };
    } else if (vote === Vote.downvote) {
      update = {
        $set: {
          [`${[review.userId]}.downvotes.${user.id}`]: true,
        },
        $unset: {
          [`${[review.userId]}.upvotes.${user.id}`]: null,
        },
      };
    } else {
      update = {
        $unset: {
          [`${[review.userId]}.upvotes.${user.id}`]: null,
          [`${[review.userId]}.downvotes.${user.id}`]: null,
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
    upsertReview,
    voteReview,
    deleteReview,
  };
}
