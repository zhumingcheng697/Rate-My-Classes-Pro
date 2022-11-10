exports = async function ({ query }) {
  if (!query || !query.code) return {};

  const { OAuth2Client } = require("google-auth-library");

  const oAuth2Client = new OAuth2Client(
    context.values.get("google-client-id"),
    context.values.get("google-secret"),
    "postmessage"
  );

  const { tokens } = await oAuth2Client.getToken(query.code);

  return tokens;
};
