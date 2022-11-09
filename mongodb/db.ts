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
import { getFullClassCode, extractClassCode } from "../libs/utils";

type MongoDoc = Realm.Services.MongoDB.Document;

type UpdateOneParams<Doc extends MongoDoc> = Parameters<
  Realm.Services.MongoDB.MongoDBCollection<Doc>["updateOne"]
>;
type Update<Doc extends MongoDoc> = UpdateOneParams<Doc>[1];
type UpdateOptions<Doc extends MongoDoc> = UpdateOneParams<Doc>[2];

export default class Database {
  constructor(user: Realm.User) {
    this.user = user;
    this.isAuthenticated = this.user.providerType !== "anon-user";
    this.db = this.user
      .mongoClient(MONGODB_SERVICE_NAME)
      .db(MONGODB_DATABASE_NAME);
  }

  private readonly user: Realm.User;
  private readonly isAuthenticated: boolean;
  private readonly db: Realm.Services.MongoDBDatabase;

  async guardUserDoc(username: string, settings: Settings) {
    if (!this.isAuthenticated) return;

    return await this.db
      .collection<UserDoc>(Collections.users)
      .findOneAndUpdate(
        { _id: this.user.id },
        {
          $setOnInsert: {
            username,
            starred: [],
            reviewed: [],
            settings,
          } as Omit<UserDoc, "_id">,
        },
        { upsert: true }
      );
  }

  async loadUserDoc() {
    if (!this.isAuthenticated) return;

    return await this.db
      .collection<UserDoc>(Collections.users)
      .findOne({ _id: this.user.id });
  }

  async updateUserDoc(update: Update<UserDoc>) {
    if (!this.isAuthenticated) return;

    await this.db
      .collection<UserDoc>(Collections.users)
      .updateOne({ _id: this.user.id }, update);
  }

  async updateUsername(username: string) {
    await this.updateUserDoc({ $set: { username } });
  }

  async updateSettings(settings: Settings) {
    await this.updateUserDoc({ $set: { settings } });
  }

  async starClass(starredClass: StarredClassInfo) {
    await this.updateUserDoc({
      $push: { starred: starredClass },
    });
  }

  async unstarClass(classCode: ClassCode) {
    await this.updateUserDoc({
      $pull: { starred: extractClassCode(classCode) },
    });
  }

  async reviewClass(reviewedClass: ReviewedClassInfo) {
    await this.updateUserDoc({
      $push: { reviewed: reviewedClass },
    });
  }

  async unreviewClass(classCode: ClassCode) {
    await this.updateUserDoc({
      $pull: { reviewed: extractClassCode(classCode) },
    });
  }

  async loadReviewDoc(classCode: ClassCode) {
    return await this.db
      .collection<ReviewDoc>(Collections.reviews)
      .findOne({ _id: getFullClassCode(classCode) });
  }

  async updateReviewDoc(
    classCode: ClassCode,
    update: Update<ReviewDoc>,
    options?: UpdateOptions<ReviewDoc>
  ) {
    if (!this.isAuthenticated) return;

    await this.db
      .collection<ReviewDoc>(Collections.reviews)
      .updateOne({ _id: getFullClassCode(classCode) }, update, options);
  }

  async submitReview(classCode: ClassCode, review: Review) {
    const id = this.user.id;
    await this.updateReviewDoc(
      classCode,
      {
        $set: {
          [`${[id]}.enjoyment`]: review.enjoyment,
          [`${[id]}.difficulty`]: review.difficulty,
          [`${[id]}.workload`]: review.workload,
          [`${[id]}.value`]: review.value,
          [`${[id]}.comment`]: review.comment,
          [`${[id]}.userId`]: review.userId,
          [`${[id]}.upvotes`]: review.upvotes,
          [`${[id]}.downvotes`]: review.downvotes,
          [`${[id]}.reviewedDate`]: review.reviewedDate,
          [`${[id]}.semester`]: review.semester,
          [`${[id]}.instructor`]: review.instructor,
        },
      },
      { upsert: true }
    );
  }

  async updateReview(classCode: ClassCode, review: Review) {
    const id = this.user.id;
    await this.updateReviewDoc(classCode, {
      $set: {
        [`${[id]}.enjoyment`]: review.enjoyment,
        [`${[id]}.difficulty`]: review.difficulty,
        [`${[id]}.workload`]: review.workload,
        [`${[id]}.value`]: review.value,
        [`${[id]}.comment`]: review.comment,
      },
    });
  }

  async voteReview(classCode: ClassCode, userId: string, vote?: Vote) {
    let update: Update<ReviewDoc>;
    const id = this.user.id;

    if (vote === Vote.upvote) {
      update = {
        $set: {
          [`${[userId]}.upvotes.${id}`]: true,
        },
        $unset: {
          [`${[userId]}.downvotes.${id}`]: null,
        },
      };
    } else if (vote === Vote.downvote) {
      update = {
        $set: {
          [`${[userId]}.downvotes.${id}`]: true,
        },
        $unset: {
          [`${[userId]}.upvotes.${id}`]: null,
        },
      };
    } else {
      update = {
        $unset: {
          [`${[userId]}.upvotes.${id}`]: null,
          [`${[userId]}.downvotes.${id}`]: null,
        },
      };
    }

    await this.updateReviewDoc(classCode, update);
  }

  async deleteReview(classCode: ClassCode) {
    await this.updateReviewDoc(classCode, {
      $unset: {
        [`${[this.user.id]}`]: null,
      },
    });
  }
}
