import Realm from "./Realm";

import type { UserDoc } from "./types";
import { tryCatch } from "../libs/utils";

enum Schema {
  user = "user",
  starred = "user_starred",
  reviewed = "user_reviewed",
  settings = "user_settings",
  selectedSemester = "user_settings_selectedSemester",
}

export default function sync(
  user: Realm.User,
  callback: (userDoc: Partial<UserDoc>) => void
) {
  const userSchema: Realm.ObjectSchema = {
    name: Schema.user,
    properties: {
      _id: "string",
      username: "string",
      starred: Schema.starred + "[]",
      reviewed: Schema.reviewed + "[]",
      settings: Schema.settings,
    },
    primaryKey: "_id",
  };

  const starredSchema: Realm.ObjectSchema = {
    name: Schema.starred,
    embedded: true,
    properties: {
      classNumber: "string?",
      departmentCode: "string?",
      description: "string?",
      name: "string?",
      schoolCode: "string?",
      starredDate: "int?",
    },
  };

  const reviewedSchema: Realm.ObjectSchema = {
    name: Schema.reviewed,
    embedded: true,
    properties: {
      classNumber: "string?",
      departmentCode: "string?",
      description: "string?",
      name: "string?",
      reviewedDate: "int?",
      schoolCode: "string?",
    },
  };

  const settingsSchema: Realm.ObjectSchema = {
    name: Schema.settings,
    embedded: true,
    properties: {
      selectedSemester: Schema.selectedSemester,
      showPreviousSemesters: "bool?",
    },
  };

  const selectedSemesterSchema: Realm.ObjectSchema = {
    name: Schema.selectedSemester,
    embedded: true,
    properties: {
      semesterCode: "string?",
      year: "int?",
    },
  };

  const realmConfig: Realm.Configuration = {
    schema: [
      userSchema,
      starredSchema,
      reviewedSchema,
      settingsSchema,
      selectedSemesterSchema,
    ],
    sync: { user, flexible: true },
  };

  tryCatch(() => {
    if (Realm.exists(realmConfig)) Realm.deleteFile(realmConfig);
  });

  return tryCatch(() => {
    const realm = new Realm(realmConfig);

    const userObj = realm
      .objects<UserDoc>(Schema.user)
      .filtered(`_id == "${user.id}"`);

    realm.subscriptions.update((sub) => {
      sub.removeAll();
      sub.add(userObj);
    });

    userObj.addListener((user) => {
      const userDoc = user.isValid() && user[0]?.toJSON();
      if (userDoc) {
        callback(userDoc);
      }
    });

    return () =>
      tryCatch(() => {
        userObj.removeAllListeners();
        realm.close();
      });
  });
}
