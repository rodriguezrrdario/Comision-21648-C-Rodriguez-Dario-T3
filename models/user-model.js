//import { v4 as uuid } from "uuid";
//import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";

// creamos una clase, que es el schema del usuario
const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//creamos el modelo de usuario que cumple con el schema definido
export const userModel = model("User", UserSchema);
