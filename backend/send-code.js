exports = async function ({ query }) {
  if (!query || !query.email || !query.id)
    throw new Error("Invalid query parameters");

  if (!/^(?:[^\s.][^\s]*[^\s.]|[^\s.]+)+@nyu\.edu$/i.test(query.email))
    throw new Error("Invalid email address. Please use your nyu.edu email.");

  const crypto = require("crypto");
  const code = crypto.randomBytes(3).toString("hex");

  const mongodb = context.services.get(context.values.get("service-name")); // eslint-disable-line no-undef
  const db = mongodb.db(context.values.get("database-name")); // eslint-disable-line no-undef
  await db
    .collection(context.values.get("collection-name")) // eslint-disable-line no-undef
    .updateOne(
      { _id: query.id },
      { code, generatedAt: Date.now() },
      { upsert: true }
    );

  const nodeMailer = require("nodemailer");

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: context.values.get("email-address"), // eslint-disable-line no-undef
      pass: context.values.get("email-password"), // eslint-disable-line no-undef
    },
  });

  await transporter.sendMail({
    from: `Rate My Classes Pro <${context.values.get("email-address")}>`, // eslint-disable-line no-undef
    to: query.email,
    subject: "Rate My Classes Confirmation Code",
    html: `<div><p>Thank you for verifying your Rate My Classes account.</p><p>Your confirmation code is:</p><p style="font-size: 2.5em; font-weight: 700; margin: 1rem 0; color: #57068c; font-family: ui-monospace, 'SF Mono', SFMono-Regular, 'DejaVu Sans Mono', Menlo, Consolas, monospace;">${code}</p><p>This code will expire in 30 minutes.</p></div>`,
  });

  return query.id;
};
