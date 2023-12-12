import { userModel } from "../models/user-model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//Registro de nuevo usuario
export const ctrlRegister = async (req, res) => {
  const newUser = await userModel.create(req.body);

  if (!newUser) return res.sendStatus(400);
  //se genera un token para el nuevo usuario
  const token = jwt.sign({ id: newUser.id }, "secret");

  res.status(201).json({ token });
};

//Login de usuario ya existente
export const ctrLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = userModel.findByEmail(email);
  //valida si el usuario existe
  if (!user) return res.sendStatus(404);

  //metodo "compare" valida el dato pasado con el que ya esta encriptado
  //devuelve si es true o false
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.sendStatus(404);

  const token = jwt.sign({ id: user.id }, "secret");

  res.status(201).json({ token });
};
