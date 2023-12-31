import { body } from "express-validator";

export const createPostValidation = [
  body("title")
    .notEmpty()
    .withMessage("El título es requerido.")
    .isString()
    .withMessage("El título debe ser un string"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion es requerida.")
    .isString()
    .withMessage("La descripcion debe ser un string"),
  body("imageURL")
    .notEmpty()
    .withMessage("La imagen es requerida.")
    .isURL()
    .withMessage("La imagen deber ser una url."),
  body("user")
    .notEmpty()
    .withMessage("El ID de usuario es requerido."),
];
