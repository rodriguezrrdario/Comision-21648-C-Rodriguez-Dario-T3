import jwt from "jsonwebtoken";
import { userModel } from "../models/user-model.js";
import { env } from "../settings/envs.js";

export const authenticationMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    console.log("...No hay token, de inicio de sesión.");
    return res.sendStatus(401);
  }
  const token = authorization;

  try {
    const { id } = jwt.verify(token, env.JWT_SECRET);

    const user = userModel.findOne(id);
    if (!user) {
      console.log("...Usuario no valido.");
      return res.sendStatus(401);
    }

    // agrega la info del User al req, para poder usarla desde el controlador de posteos
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
};
