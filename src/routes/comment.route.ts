import { Router } from "express";
const route = Router();
import { authMiddleware } from "../middlewares/auth.middlewares";
import {validateAndConvertIds } from "../middlewares/global.middlewares";
import commentController from "../controllers/comment.controller";

route.post("/:newsId", authMiddleware, validateAndConvertIds, commentController.addComment);
route.get("/commentPage/:newsId", authMiddleware, validateAndConvertIds, commentController.getPaginatedComments);
route.delete("/deleteComment/:dataCommentId/:commentId", authMiddleware, validateAndConvertIds, commentController.deleteComment);
route.post("/likeComment/:dataCommentId/:commentId", authMiddleware, validateAndConvertIds, commentController.likeComment);

export default route;
