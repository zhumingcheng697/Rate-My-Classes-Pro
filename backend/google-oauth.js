exports = async function ({ query }) {
  if (!query || (query.action === "revoke" ? !query.token : !query.code))
    return {};

  const { OAuth2Client } = require("google-auth-library");

  const client = new OAuth2Client(
    context.values.get("google-client-id"), // eslint-disable-line no-undef
    context.values.get("google-secret"), // eslint-disable-line no-undef
    query.platform === "web"
      ? "postmessage"
      : context.values.get("realm-backend-url") // eslint-disable-line no-undef
  );

  if (query.action === "revoke") {
    return await client.revokeToken(query.token);
  }

  const { tokens } = await client.getToken(query.code);

  return tokens;
};
