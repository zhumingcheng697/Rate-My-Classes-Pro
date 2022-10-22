import Realm from "./Realm";
import {
  MONGODB_DATABASE_NAME,
  MONGODB_SERVICE_NAME,
} from "react-native-dotenv";

import { Collections, UserDoc } from "./types";

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
        const { fullDocument } = event;

        if (fullDocument) {
          callback(fullDocument);
        }
      }
    }
  })();

  return () => {
    stream.return(null);
  };
}
