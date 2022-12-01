exports = async function ({ query }) {
  if (!query || !query.class) return {};

  const mongodb = context.services.get(context.values.get("service-name"));
  const db = mongodb.db(context.values.get("database-name"));
  const doc = await db.collection("reviews").findOne({ _id: query.class });

  if (!doc) return {};

  delete doc["_id"];

  let enjoyment = 0;
  let difficulty = 0;
  let workload = 0;
  let value = 0;

  let count = 0;

  for (let review of Object.values(doc)) {
    enjoyment += review.enjoyment;
    difficulty += review.difficulty;
    workload += review.workload;
    value += review.value;
    ++count;
  }

  if (count == 0) {
    return {};
  }

  enjoyment /= count;
  difficulty /= count;
  workload /= count;
  value /= count;

  return { enjoyment, difficulty, workload, value };
};
