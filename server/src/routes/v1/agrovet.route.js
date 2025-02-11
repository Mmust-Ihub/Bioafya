import { Router } from "express";
import agrovetController from "../../modules/agrovet/agrovet.controller.js";
const agrovetRouter = Router();

agrovetRouter.post("/register", agrovetController.registerAgrovet);
agrovetRouter.post("/subscribe", agrovetController.subscribeAgrovet);
agrovetRouter.post("/login", agrovetController.loginAgrovet);

export default agrovetRouter;
