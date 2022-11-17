exports = async function ({ query }) {
  if (!query || !query.code || !query.id)
    throw new Error("Invalid query parameters");

  const mongodb = context.services.get(context.values.get("service-name"));
  const db = mongodb.db(context.values.get("database-name"));
  const doc = await db
    .collection(context.values.get("collection-name"))
    .findOneAndDelete({ _id: query.id });

  if (doc && doc.code === query.code) {
    await db
      .collection("users")
      .updateOne({ _id: query.id }, { $set: { verified: true } });

    return query.id;
  }

  throw new Error("Unable to verify confirmation code. Please try again.");
};
