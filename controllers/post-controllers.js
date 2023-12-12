import { postModel } from "../models/post-model.js";

//crear nuevo posteo
export function ctrlCreatePost(req, res) {
  const { title, desc, image } = req.body;

  postModel.create({ title, desc, image });

  res.sendStatus(201);
}

//obtener todos los posteos
export const ctrlGetAllPosts = (req, res) => {
  const posts = postModel.findAll(req.user.id);
  res.json(posts);
};

//obtener un posteo (por ID)
export const ctrlGetPostById = (req, res) => {
  const { postId } = req.params;

  const post = postModel.findOne({ id: postId });

  if (!post) {
    return res.sendStatus(404);
  }

  res.status(200).json(post);
};

//actualizar posteo
export const ctrlUpdatePost = (req, res) => {
  console.log(req.params);

  const { postId } = req.params;

  const { title, desc, image } = req.body;

  const updatedPost = postModel.update(postId, { title, desc, image });

  if (!updatedPost) return res.sendStatus(404);

  res.sendStatus(200);
};

//borrar posteo
export const ctrlDeletePost = (req, res) => {
  const { postId } = req.params;

  postModel.destroy({ id: postId });

  res.sendStatus(200);
};
