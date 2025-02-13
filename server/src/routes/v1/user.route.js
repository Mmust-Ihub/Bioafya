import { Router } from "express";
import userController from "../../modules/user/user.controller.js";
import jwt from "../../helpers/jwt.js"

const userRouter = Router();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/profile", jwt.verifyAccessToken, userController.userProfile);
userRouter.post("/select-vet", jwt.verifyAccessToken, userController.selectVet);

export default userRouter;
