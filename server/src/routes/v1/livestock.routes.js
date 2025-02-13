import { Router } from "express";
import livestockController from "../../modules/livestock/livestock.controller.js";
import jwt from "../../helpers/jwt.js"

const livestockRouter = Router();

livestockRouter.post("/", jwt.verifyAccessToken, livestockController.createLivestock);
livestockRouter.get("/", jwt.verifyAccessToken, livestockController.getLivestock);
livestockRouter.post("/sensor", livestockController.ingest);

export default livestockRouter;
