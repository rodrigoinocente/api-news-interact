import { Router } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import commentRouter from "./comment.route";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/comment", commentRouter);

export default router;