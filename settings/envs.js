import { config } from "dotenv";

config();

export const env = {
  PORT: process.env.PORT || 4000,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,

  JWT_SECRET: process.env.JWT_SECRET || "secret",

  MONGO_URI: process.env.MONGO_URI,
};

//exportar Clave privada para generar token de ID para el usuario
