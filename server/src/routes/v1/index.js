import { Router } from "express";

import agrovetRouter from "./agrovet.route.js";
import modelRouter from "./model.route.js";
import userRouter from "./user.route.js";
import livestockRouter from "./livestock.routes.js";
const router = Router();

const defaultRoutes = [
  {
    path: "/agrovet",
    route: agrovetRouter,
  },
  {
    path: "/model",
    route: modelRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/livestock",
    route: livestockRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router ;
