import { config } from "dotenv";

config();

export const env = {
  PORT: process.env.PORT || 4000,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};

//exportar Clave privada para generar token de ID para el usuario
