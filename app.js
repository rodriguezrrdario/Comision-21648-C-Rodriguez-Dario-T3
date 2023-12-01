import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fileUpload from "express-fileupload";

import * as url from "url";

import { postsRouter } from "./routes/post-routes.js";
import { userRouter } from "./routes/user-routes.js";

import { env } from "./settings/envs.js";
import { authenticationMiddleware } from "./middlewares/authentication-middleware.js";
import { authorizationMiddleware } from "./middlewares/authorization-middleware.js";

import path from "node:path";
import fs from "node:fs/promises";

import { createTransport } from "nodemailer";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);
app.use(express.static("uploads"));

// app.use(validatePost);

app.post("/upload", async (req, res) => {
  console.log(req.files);

  const { image } = req.files;

  fs.mkdir(path.join(__dirname, "uploads"), { recursive: true });

  await image.mv(path.join(__dirname, "uploads", image.name));

  fs.rm(path.join(__dirname, "temp"), { recursive: true });

  res.send("upload");
});

// Cloudinary  es un servicio de terceros que nos permite gestionar imagenes.

app.use(
  "/posts",
  authenticationMiddleware,
  authorizationMiddleware,
  postsRouter
);
app.use("/users", userRouter);

const transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "rodriguezrrdario@gmail.com",
    pass: env.MAIL_PASSWORD,
  },
});

app.post("/send-email", async (req, res) => {
  try {
    const { destinatario, motivo, mensaje } = req.body;

    const response = await transporter.sendMail({
      from: "rodriguezrrdario@gmail.com",
      to: destinatario,
      subject: motivo,
      text: mensaje,
    });

    console.log(response);

    res.send("email sent");
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
});

app.listen(env.PORT, () => {
  console.log(`.
  .
   .
    ...Servidor funcionando en el puerto ${env.PORT}`);
});
