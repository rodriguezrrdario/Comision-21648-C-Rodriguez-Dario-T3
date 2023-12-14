import { body, param } from "express-validator";

export const updatePostValidation = [
  param("postId").isString().withMessage("La id debe ser un numero"),
  body("title")
    .optional()
    .isString()
    .withMessage("El título debe ser un string"),
  body("description")
    .optional()
    .isString()
    .withMessage("La descripcion debe ser un string"),
  body("imageURL")
    .optional()
    .isURL()
    .withMessage("La imagen deber ser una url."),
];
