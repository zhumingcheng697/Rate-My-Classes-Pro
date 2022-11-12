import Realm from "./Realm";
import {
  MONGODB_DATABASE_NAME,
  MONGODB_SERVICE_NAME,
} from "react-native-dotenv";

import { Collections, UserDoc } from "./types";

export default function sync(
  user: Realm.User,
  callback: (userDoc?: Partial<UserDoc>) => void
) {
  let syncing = true;

  const db = user.mongoClient(MONGODB_SERVICE_NAME).db(MONGODB_DATABASE_NAME);

  const stream = db.collection<UserDoc>(Collections.users).watch(
    [{ $match: { _id: user.id } }],
    // @ts-ignore
    { fullDocument: "updateLookup" }
  );

  (async () => {
    for await (const event of stream) {
      if (!syncing) return;

      if (event.operationType === "update") {
        callback(event.fullDocument);
      } else if (event.operationType === "delete") {
        callback();
      }
    }
  })();

  return () => {
    syncing = false;
    stream.return(null);
  };
}
