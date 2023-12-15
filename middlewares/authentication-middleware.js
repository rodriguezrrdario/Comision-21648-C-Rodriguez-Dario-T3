import jwt from "jsonwebtoken";
import { userModel } from "../models/user-model.js";
import { env } from "../settings/envs.js";

export const authenticationMiddleware = (req, res, next) => {
  //desestructuración de los headers enviados por metodo POST
  //me quedo con el token que se generó al iniciar sesión
  const { authorization } = req.headers;

  if (!authorization) {
    console.log("...No hay token, de inicio de sesión.");
    return res.sendStatus(401);
  }
  const token = authorization;

  try {
    //chequeo el token con la palabra secreta de la variable de entorno
    // y genero el ID del usuario
    const { id } = jwt.verify(token, env.JWT_SECRET);

    //busco el usuario segun el ID chequeado
    const user = userModel.findOne({ id });
    if (!user) {
      console.log("...Usuario no valido.");
      return res.sendStatus(401);
    }

    console.log(user);

    // agrega la info del User al req, para poder usarla desde el controlador de posteos
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    //console.log("paso por el Authentication-middleware.");
    return res.sendStatus(401);
  }
};
