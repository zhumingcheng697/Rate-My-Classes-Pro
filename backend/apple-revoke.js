exports = async function ({ token, platform }) {
  if (!token) return;

  const appleSignin = require("apple-signin-auth");

  const clientID = context.values.get(
    platform === "web" ? "apple-service-id" : "apple-app-id"
  );

  const clientSecret = appleSignin.getClientSecret({
    clientID,
    teamID: context.values.get("apple-team-id"),
    privateKey: context.values.get("apple-private-key"),
    keyIdentifier: context.values.get("apple-private-key-id"),
  });

  return await appleSignin.revokeAuthorizationToken(token, {
    clientID,
    clientSecret,
    tokenTypeHint: "refresh_token",
  });
};
