import { Router } from "express";
import authController from "../controllers/auth.controller";

const route = Router();

route.post("/", authController.login);
route.delete("/logout", authController.logout);

export default route;