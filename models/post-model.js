import { Schema, Types, model } from "mongoose";

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
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  //TODO falta implementar
  //comments: String
  {
    timestamps: true,
  }
);

export const PostModel = model("Post", PostSchema);
