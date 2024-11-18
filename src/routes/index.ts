import { Router } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import commentRouter from "./comment.route";
import replyRouter from "./reply.route";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/comment", commentRouter);
router.use("/reply", replyRouter);

export default router;