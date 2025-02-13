import { Router } from "express";
import modelController from "../../modules/model/model.controller.js";
import jwt from "../../helpers/jwt.js"

const modelRouter = Router();

modelRouter.post("/predict", jwt.verifyAccessToken, modelController.predictDisease);

export default modelRouter;
