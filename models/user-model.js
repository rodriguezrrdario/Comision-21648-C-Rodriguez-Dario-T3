//import { v4 as uuid } from "uuid";
//import bcrypt from "bcrypt";
import { Schema, model, Types } from "mongoose";

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

    // SE CREA la relación asociada entre usuarios y posts.
    // Dentro de "posts", creo un array con objetos que caracterizan a los posts
    // el primero va a ser de un tipo especial (ObjectId)
    // donde se guardan los que hacen referenca a "Post"
    // Se llama "Post" porque hace referencia al nombre creado en el post-model.js
    posts: [
      {
        type: Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//creamos el modelo de usuario que cumple con el schema definido
export const userModel = model("User", UserSchema);
