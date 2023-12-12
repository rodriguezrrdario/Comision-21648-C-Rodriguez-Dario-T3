export const authorizationMiddleware = (req, res, next) => {
  // console.log("pasó por el authorization-Middleware");

  //si la propiedad "isAdmin" es false, retorna un 401
  if (!req.user.isAdmin)
    return res
      .status(401)
      .send(`SIN AUTORIZACIÓN: Usuario "${req.user.name}" no es un Admin.`);

  next();
};
