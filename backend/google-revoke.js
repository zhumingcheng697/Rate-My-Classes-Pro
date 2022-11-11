exports = async function ({ token }) {
  if (!token) return;

  const { OAuth2Client } = require("google-auth-library");

  const client = new OAuth2Client(
    context.values.get("google-client-id"),
    context.values.get("google-secret"),
    "postmessage"
  );

  return await client.revokeToken(token);
};
