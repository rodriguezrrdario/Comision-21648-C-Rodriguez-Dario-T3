import { Router } from "express";
import { ctrLogin, ctrlRegister } from "../controllers/user-controllers.js";

const userRouter = Router();

userRouter.post("/register", ctrlRegister);

userRouter.post("/login", ctrLogin);

export { userRouter };
