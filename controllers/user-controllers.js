import { userModel } from "../models/user-model.js";
import { PostModel } from "../models/post-model.js";
import { env } from "../settings/envs.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//REGISTRO de nuevo usuario -OK
export const ctrlRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // el metodo hash de bcrypt, genera textos encriptados
    // le paso la contraseña para encriptar
    // y la cantidad de veces que quiero encriptarla (10)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserInfo = {
      name,
      email,
      password: hashedPassword,
      isAdmin: name === "seba", // TODO Cambiar para que valide de otra forma
    };

    // crear nuevo usuario usando el ODM Mongoose
    const user = await userModel.create(newUserInfo);
    if (!user) return res.sedStatus(400);

    //se genera un token para el nuevo usuario
    const token = jwt.sign({ id: req.id }, env.JWT_SECRET);

    //devuelve el nombre del usuario y el token generado
    res.status(201).json({ token });

    console.log(`Usuario creado: "${name}"`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

//OBTENER lista de usuarios -OK
export const ctrlListUsers = async (_req, res) => {
  try {
    const allUsers = await userModel
      //el metodo ".find" es el que me busca todos los usuarios, y no me muestra la version, ni fecha de update
      .find({}, ["-password", "-__v", "-createdAt", "-updatedAt"])
      //el metodo ".populate" me muestra todos los campos que tiene "posts" a lo que se hace referencia este usuario
      .populate("posts", ["-__v", "-createdAt", "-updatedAt", "-user"]);

    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// OBTENER un usuario segun su ID   -OK
export const ctrlFindOneUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel
      .findOne({ _id: userId })
      .populate("posts", ["-user", "-__v"]);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

// BUSCAR un usuario por email (para el Login)   -OK
export const getUserByEmail = async ({ email }) => {
  try {
    const user = await userModel.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

//LOGIN de usuario  -OK
export const ctrlLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    //valida si el usuario existe
    const user = await getUserByEmail({ email });
    if (!user) {
      console.log("Email no válido.");
      return res.sendStatus(404);
    }

    //metodo "compare" valida el dato pasado con el que ya esta encriptado
    //devuelve si es true o false
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Contraseña no válida.");
      return res.sendStatus(404);
    }
    //metodo sign que genera un token usando la libreria JWT y la palabra secreta definida
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET);

    console.log(`...Login correcto de "${user.name}"`);
    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

//ACTUALIZAR info de usuario   -OK
export const ctrlUpdateUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      req.body,
      { new: true } //propiedad para que me devuelva el producto actualizado
    );
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

// ELIMINAR usuario y sus posteos    -OK
export const ctrlDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // obtengo el usuario segun el ID
    const user = await userModel.findById(userId);
    if (!user) return res.sendStatus(404);

    // Obtenemos los posteos realizados por el usuario
    const allThisUserPosts = await PostModel.find({ user: userId });

    // primero elimino todos los posteos del usuario (si tiene)
    // sino los posteos van a quedar en la BD, pero sin autor
    if (allThisUserPosts.length > 1) {
      await PostModel.deleteMany({ _id: { $in: allThisUserPosts } });
    }
    // eliminamos el usuario
    await user.deleteOne();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
