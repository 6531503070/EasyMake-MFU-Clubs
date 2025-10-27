export const env = {
  PORT: process.env.PORT || 8081,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/easymake",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",

  EMAIL_FROM: process.env.EMAIL_FROM || "noreply@easymake.mfu.ac.th",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SUPERADMIN_SETUP_SECRET: process.env.SUPERADMIN_SETUP_SECRET || "",
  SMTP_USER: process.env.SMTP_USER || "example@gmail.com",
  SMTP_PASS: process.env.SMTP_PASS || "password",
};
