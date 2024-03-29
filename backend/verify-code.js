exports = async function ({ query }) {
  if (!query || !query.code || !query.id)
    throw new Error("Invalid query parameters");

  const mongodb = context.services.get(context.values.get("service-name")); // eslint-disable-line no-undef
  const db = mongodb.db(context.values.get("database-name")); // eslint-disable-line no-undef
  const doc = await db
    .collection(context.values.get("collection-name")) // eslint-disable-line no-undef
    .findOneAndDelete({ _id: query.id });

  if (doc && doc.code === query.code) {
    if (Date.now() - doc.generatedAt >= 30 * 60 * 1000) {
      throw new Error("The confirmation code has expired. Please try again.");
    }

    await db
      .collection("users")
      .updateOne({ _id: query.id }, { $set: { verified: true } });

    return query.id;
  }

  throw new Error("Unable to verify confirmation code. Please try again.");
};
