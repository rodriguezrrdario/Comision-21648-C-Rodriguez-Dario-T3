import { config } from "dotenv";

config();

export const env = {
  PORT: process.env.PORT || 4000,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};
