import { userModel } from "../models/user-model.js";
import { env } from "../settings/envs.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//REGISTRO de nuevo usuario -OK
export const ctrlRegister = async (req, res) => {
  try {
    //if (!newUser) return res.sendStatus(404);
    const { name, email, password } = req.body;

    // el metodo hash de bcrypt, genera textos encriptados
    // le paso la contraseña para encriptar
    // y la cantidad de veces que quiero encriptarla (10)
    const hashedPassword = await bcrypt.hash(password, 10);

    //se genera un token para el nuevo usuario
    const token = jwt.sign({ id: req.id }, env.JWT_SECRET);

    const newUserInfo = {
      name,
      email,
      password: hashedPassword,
      isAdmin: name === "seba", // TODO Cambiar para que valide de otra forma
    };

    // crear nuevo usuario usando el ODM Mongoose
    const user = await userModel.create(newUserInfo);

    //devuelve el nombre del usuario y el token generado
    res.status(201).json({ name, token });

    console.log(`Usuario creado: "${name}"`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

//OBTENER lista de usuarios -OK
export const ctrlListUsers = async (_req, res) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// OBTENER un usuario segun su ID
export const ctrlFindOneUser = async ({ id }) => {
  try {
    const user = await userModel.findById(id);
    return user;
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// OBTENER un usuario segun su email
export const getUserByEmail = async ({ email }) => {
  try {
    const user = await userModel.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

//LOGIN de usuario
export const ctrlLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail({ email });
    //valida si el usuario existe
    if (!user) return res.sendStatus(404);

    //metodo "compare" valida el dato pasado con el que ya esta encriptado
    //devuelve si es true o false
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.sendStatus(404);
    //metodo sign que genera un token usando la libreria JWT y la palabra secreta definida
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET);

    console.log(`...Login correcto de: "${user.name}"`);
    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

//ACTUALIZAR info de usuario
export const ctrlUpdateUser = async (id, datos) => {
  try {
    const user = await userModel.findByIdAndUpdate(id, datos, { new: true });
    console.log("Usuario editado.");
    return user;
  } catch (error) {
    console.log(error);
  }
};

// ELIMINAR usuario
export const ctrlDeleteUser = async (id) => {
  try {
    await userModel.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
  }
};
