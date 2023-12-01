import { userModel } from "../models/user-model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const ctrlRegister = async (req, res) => {
  const newUser = await userModel.create(req.body);

  if (!newUser) return res.sendStatus(400);

  const token = jwt.sign({ id: newUser.id }, "secret");

  res.status(201).json({ token });
};

export const ctrLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = userModel.findByEmail(email);

  if (!user) return res.sendStatus(404);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.sendStatus(404);

  const token = jwt.sign({ id: user.id }, "secret");

  res.status(201).json({ token });
};
