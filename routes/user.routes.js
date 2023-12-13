import { Router } from "express";
import {
  ctrlRegister,
  ctrlLogin,
  ctrlListUsers,
  ctrlFindOneUser,
  ctrlUpdateUser,
  ctrlDeleteUser,
} from "../controllers/user-controllers.js";

import { applyValidations } from "../middlewares/applyValidations.js";

const userRouter = Router();

userRouter.get("/", ctrlListUsers);

userRouter.post("/register", applyValidations, ctrlRegister);
userRouter.post("/login", ctrlLogin);

userRouter.get("/:userId", ctrlFindOneUser);
userRouter.patch("/:userId", ctrlUpdateUser);
userRouter.delete("/:userId", ctrlDeleteUser);

export { userRouter };
