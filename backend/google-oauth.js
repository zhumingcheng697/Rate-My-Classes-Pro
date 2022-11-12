exports = async function ({ query }) {
  if (!query || !query.code) return {};

  const { OAuth2Client } = require("google-auth-library");

  const client = new OAuth2Client(
    context.values.get("google-client-id"),
    context.values.get("google-secret"),
    query.platform === "web"
      ? "postmessage"
      : context.values.get("realm-backend-url")
  );

  const { tokens } = await client.getToken(query.code);

  return tokens;
};
