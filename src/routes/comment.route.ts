import { Router } from "express";
const route = Router();
import { authMiddleware } from "../middlewares/auth.middlewares";
import {validateAndConvertIds } from "../middlewares/global.middlewares";
import commentController from "../controllers/comment.controller";

route.post("/:newsId", authMiddleware, validateAndConvertIds, commentController.addComment);
route.get("/commentPage/:newsId", authMiddleware, validateAndConvertIds, commentController.getPaginatedComments);

export default route;
