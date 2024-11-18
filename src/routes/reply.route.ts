import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { validateAndConvertIds } from "../middlewares/global.middlewares";
import replyController from "../controllers/reply.controller";
const route = Router();

route.post("/:dataCommentId/:commentId", authMiddleware, validateAndConvertIds, replyController.addReplyComment);

export default route;