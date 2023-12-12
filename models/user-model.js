import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

let listOfUsers = [];

const createNewUser = async ({ name, email, password }) => {
  if (!name || !email || !password) return null;

  // el metodo hash de bcrypt, genera textos encriptados
  // le paso la contraseña para encriptar
  // y la cantidad de veces que quiero encriptarla (10)
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuid(),
    name,
    email,
    password: hashedPassword,
    isAdmin: name === "seba",
  };

  listOfUsers.push(newUser);

  console.log(newUser);

  return newUser;
};

const getUserById = (id) => {
  const user = listOfUsers.find((user) => user.id === id);

  return user;
};

const getUserByEmail = (email) => {
  const user = listOfUsers.find((user) => user.email === email);

  return user;
};

export const userModel = {
  create: createNewUser,
  findOne: getUserById,
  findByEmail: getUserByEmail,
};
