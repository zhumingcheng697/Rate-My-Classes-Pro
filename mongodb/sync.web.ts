import Realm from "./Realm";
import {
  MONGODB_DATABASE_NAME,
  MONGODB_SERVICE_NAME,
} from "react-native-dotenv";

import { Collections, UserDoc } from "./types";

type UpdateKey = Exclude<keyof UserDoc, "_id">;

export default function sync(
  user: Realm.User,
  callback: (userDoc: Partial<UserDoc>) => void
) {
  const db = user.mongoClient(MONGODB_SERVICE_NAME).db(MONGODB_DATABASE_NAME);

  const stream = db.collection<UserDoc>(Collections.users).watch(
    [{ $match: { $and: [{ _id: user.id }, { operationType: "update" }] } }],
    // @ts-ignore
    { fullDocument: "updateLookup" }
  );

  (async () => {
    for await (const event of stream) {
      if (event.operationType === "update") {
        const { updateDescription, fullDocument } = event;

        if (!fullDocument) continue;

        const updatedKeys: Set<UpdateKey> = new Set();

        Object.keys(updateDescription.updatedFields)
          .concat(updateDescription.removedFields)
          .map((path) => path.split(".")[0])
          .forEach((key) => updatedKeys.add(key as UpdateKey));

        for (let key of Object.keys(fullDocument)) {
          const updatedKey = key as UpdateKey;
          if (!updatedKeys.has(updatedKey)) {
            delete fullDocument[updatedKey];
          }
        }

        callback(fullDocument);
      }
    }
  })();

  return () => {
    stream.return(null);
  };
}
