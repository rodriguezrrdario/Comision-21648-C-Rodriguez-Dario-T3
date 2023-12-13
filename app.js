import express from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fileUpload from "express-fileupload";

// to_do lo que venga de la libreria "url" lo renombramos como url
import * as url from "url";

import { postsRouter } from "./routes/post.routes.js";
import { userRouter } from "./routes/user.routes.js";

import { env } from "./settings/envs.js";
import { authenticationMiddleware } from "./middlewares/authentication-middleware.js";
import { authorizationMiddleware } from "./middlewares/authorization-middleware.js";

import path from "node:path";
// importamos el FileSystem para manejar archivos
// usamos el "/promises" para poder trabajar con promesas en lugar de callbacks
import fs from "node:fs/promises";

// importamos el siguiente metodo del nodemailer
import { createTransport } from "nodemailer";
import { startConnection } from "./settings/database.js";

// definimos la carpeta donde se encuentra mi proyecto, el app.js
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();

// MIDDLEWARES (funciones que se ejecutan antes de llegar a la ruta)
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

//seteo de la carpeta de archivos estaticos
app.use(express.static("uploads"));

// app.use(validatePost);

app.post("/upload", async (req, res) => {
  //files es una propiedad que el FileUpload le agregó al Request
  console.log(req.files);

  const { image } = req.files;

  //creamos la carpeta uploads, donde se van a guardar los archivos
  // uniendo el path actual con la carpeta deseada
  // usamos el Recursive para sobreescribir la carpeta, por si ya estaba creada
  fs.mkdir(path.join(__dirname, "uploads"), { recursive: true });

  await image.mv(path.join(__dirname, "uploads", image.name));

  // removemos la carpeta temporal
  fs.rm(path.join(__dirname, "temp"), { recursive: true });

  res.send("Imagen subida");
});

// El middleware de autorización siempre va despues de la autenticación
app.use(
  "/posts",
  authenticationMiddleware,
  authorizationMiddleware,
  postsRouter
);
app.use("/users", userRouter);

//instanciamos un transportador directamente con el metodo del nodemailer
const transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "prueba.proyecto.sistema@gmail.com",
    pass: env.MAIL_PASSWORD,
  },
});

app.post("/send-email", async (req, res) => {
  try {
    const { destinatario, motivo, mensaje } = req.body;

    const response = await transporter.sendMail({
      from: "prueba.proyecto.sistema@gmail.com",
      to: destinatario,
      subject: motivo,
      text: mensaje,
    });

    console.log(response);
    res.send("e-Mail enviado");
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
});

app.listen(env.PORT, async () => {
  //Conección a la base de datos
  await startConnection();
  console.log(`..
   ...Servidor funcionando en el puerto ${env.PORT}`);
});
