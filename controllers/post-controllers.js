import { PostModel } from "../models/post-model.js";

//CREAR nuevo posteo
export const ctrlCreatePost = async (req, res) => {
  try {
    const newPost = await PostModel.create(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

//OBTENER todos los posteos
// omitiendo la version y fecha de actualizado
export const ctrlGetAllPosts = async (req, res) => {
  try {
    const allPosts = await PostModel.find({}, ["-__v", "-updatedAt"]);
    //const allPosts = await PostModel.findAll(req.user.id);

    //Si no hay posteos devuelve que no hay contenido
    if (allPosts.length < 1) return res.sendStatus(204);

    res.json(allPosts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

//OBTENER un posteo
// que cumpla con lo buscado (Ej: ID, name, etc)
export const ctrlGetPost = async (req, res) => {
  const { postId } = req.params;
  try {
    //Ejemp usando metodo "findOne" para buscar por más de un parametro, enviados como objeto
    //const post = await PostModel.findOne({ id: postId, name: "nombreBuscado" });
    const post = await PostModel.findById({ _id: postId }, [
      "-__v",
      "-updatedAt",
    ]);
    if (!post) {
      return res.sendStatus(404);
    }

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

//ACTUALIZAR un posteo
export const ctrlUpdatePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      req.body,
      { new: true } //propiedad para que me devuelva el producto actualizado
    );
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

//BORRAR un posteo
export const ctrlDeletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    await PostModel.findOneAndDelete({ _id: postId });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
