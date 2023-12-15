import { PostModel } from "../models/post-model.js";
import { userModel } from "../models/user-model.js";

//CREAR nuevo posteo   -OK
export const ctrlCreatePost = async (req, res) => {
  try {
    //Desde el body, obtenemos el usuario que crea el post
    const user = await userModel.findById(req.body.user);
    //valida que exista el usuario, para que no sea un post sin usuario
    if (!user) {
      console.log("No hay User definido.");
      return res.sendStatus(404);
    }
    //creamos el post
    const newPost = await PostModel.create(req.body);

    //agregamos en el User indicado, el posteo creado y guardamos
    user.posts.push(newPost._id);
    await user.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

//OBTENER todos los posteos   -OK
export const ctrlGetAllPosts = async (req, res) => {
  try {
    // omitiendo la version y fecha de actualizado
    const allPosts = await PostModel.find({}, ["-__v", "-updatedAt"])
      //para que me muestre la info del User, (solo el name me interesa)
      .populate("user", "name");

    //obtner todos los posteos, segun el id del user
    //const allPosts = await PostModel.findAll(req.user.id);

    //Si no hay posteos devuelve que no hay contenido
    if (allPosts.length < 1) {
      console.log("No hay posteos.");
      return res.sendStatus(204);
    }
    res.status(200).json(allPosts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

//OBTENER un posteo por ID   -OK
export const ctrlGetPost = async (req, res) => {
  const { postId } = req.params;

  try {
    //Ejemp usando metodo "findOne" para buscar por más de un parametro, enviados como objeto
    //const post = await PostModel.findOne({ id: postId, name: "nombreBuscado" });
    const post = await PostModel.findById({ _id: postId }, [
      "-__v",
      "-updatedAt",
    ]).populate("user", ["_id", "name", "email"]);
    if (!post) {
      return res.sendStatus(404);
    }

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

//ACTUALIZAR un posteo   -OK
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

//BORRAR un posteo   -OK
export const ctrlDeletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // obtengo el post segun el ID
    const post = await PostModel.findById(postId);
    if (!post) return res.sendStatus(404);

    //obtengo el usuario segun el post
    const user = await userModel.findById(post.user);

    //eliminamos el post
    await post.deleteOne();

    // Y tambien actualizamos la info del usuario, borrando el posteo indicado
    //para que la info coincida en ambos lados (usuario y posteos)
    await user.updateOne({ $pull: { posts: post._id } });

    //otra forma de eliminar el post
    //await PostModel.findOneAndDelete({ _id: postId });

    //otra forma de eliminar el post
    //user.posts = user.posts.filter((post) => post._id != postId);
    //await user.save();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
