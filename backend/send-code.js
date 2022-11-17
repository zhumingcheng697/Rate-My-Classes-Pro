exports = async function ({ query }) {
  if (!query || !query.email || !query.id)
    throw new Error("Invalid query parameters");

  const crypto = require("crypto");
  const code = crypto.randomBytes(3).toString("hex");

  const mongodb = context.services.get(context.values.get("service-name"));
  const db = mongodb.db(context.values.get("database-name"));
  await db
    .collection(context.values.get("collection-name"))
    .updateOne({ _id: code }, { userId: query.id }, { upsert: true });

  const nodeMailer = require("nodemailer");

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: context.values.get("email-address"),
      pass: context.values.get("email-password"),
    },
  });

  await transporter.sendMail({
    from: `Rate My Classes Pro <${context.values.get("email-address")}>`,
    to: query.email,
    subject: "Rate My Classes Confirmation Code",
    html: `<div><p>Thank you for verifying your Rate My Classes account!</p><p>Your confirmation code is: </p><p style="font-size: 2.5em; font-weight:700; margin: 1rem 0; font-family: monospace;">${code}</p></div>`,
  });

  return query.id;
};
