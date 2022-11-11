exports = async function ({ query }) {
  if (!query || !query.code) return {};

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

  return await appleSignin.getAuthorizationToken(code, {
    clientID,
    redirectUri: context.values.get("web-deployment-url"),
    clientSecret,
  });
};
