import { Router } from "express";

import agrovetRouter from "./agrovet.route.js";
const router = Router();

const defaultRoutes = [
  {
    path: "/agrovet",
    route: agrovetRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router ;
