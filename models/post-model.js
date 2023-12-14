import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    //id: uuid(),
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      //required: false,
    },
    //TODO falta implementar
    //autor: String,
    //comments: String,
  },
  {
    timestamps: true,
  }
);

export const PostModel = model("Post", PostSchema);
