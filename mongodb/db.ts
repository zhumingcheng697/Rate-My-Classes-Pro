import Realm, { type User } from "realm";

import { type UserDoc, type ClassDoc, Collections } from "./types";
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

  async function loadClassDoc(classCode: ClassCode) {
    return await db
      .collection<ClassDoc>(Collections.classes)
      .findOne({ _id: getFullClassCode(classCode) });
  }

  async function updateClassDoc(
    classCode: ClassCode,
    update: Realm.Services.MongoDB.Update,
    options?: Realm.Services.MongoDB.UpdateOptions
  ) {
    if (!isAuthenticated) return;

    await db
      .collection<ClassDoc>(Collections.classes)
      .updateOne({ _id: getFullClassCode(classCode) }, update, options);
  }

  async function upsertReview(classCode: ClassCode, review: Review) {
    await updateClassDoc(
      classCode,
      {
        $set: {
          [`reviews.${[user.id]}.enjoyment`]: review.enjoyment,
          [`reviews.${[user.id]}.difficulty`]: review.difficulty,
          [`reviews.${[user.id]}.workload`]: review.workload,
          [`reviews.${[user.id]}.value`]: review.value,
          [`reviews.${[user.id]}.comment`]: review.comment,
        },
        $setOnInsert: {
          [`reviews.${[user.id]}.userId`]: review.userId,
          [`reviews.${[user.id]}.upvotes`]: review.upvotes,
          [`reviews.${[user.id]}.downvotes`]: review.downvotes,
          [`reviews.${[user.id]}.reviewedDate`]: review.reviewedDate,
          [`reviews.${[user.id]}.semester`]: review.semester,
          [`reviews.${[user.id]}.instructor`]: review.instructor,
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
          [`reviews.${[review.userId]}.upvotes.${user.id}`]: true,
        },
        $unset: {
          [`reviews.${[review.userId]}.downvotes.${user.id}`]: null,
        },
      };
    } else if (vote === Vote.downvote) {
      update = {
        $set: {
          [`reviews.${[review.userId]}.downvotes.${user.id}`]: true,
        },
        $unset: {
          [`reviews.${[review.userId]}.upvotes.${user.id}`]: null,
        },
      };
    } else {
      update = {
        $unset: {
          [`reviews.${[review.userId]}.upvotes.${user.id}`]: null,
          [`reviews.${[review.userId]}.downvotes.${user.id}`]: null,
        },
      };
    }

    await updateClassDoc(classCode, update);
  }

  async function deleteReview(classCode: ClassCode) {
    await updateClassDoc(classCode, {
      $unset: {
        [`reviews.${[user.id]}`]: null,
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
    loadClassDoc,
    upsertReview,
    voteReview,
    deleteReview,
  };
}
