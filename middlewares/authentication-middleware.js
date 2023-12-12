import jwt from "jsonwebtoken";
import { userModel } from "../models/user-model.js";

export const authenticationMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.sendStatus(401);

  const token = authorization;

  try {
    const { id } = jwt.verify(token, "secret");

    const user = userModel.findOne(id);

    // agrega la info del User al req, para poder usarla desde el controlador de posteos
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
};
