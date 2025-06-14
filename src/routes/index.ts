import { Router } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import commentRouter from "./comment.route";
import replyRouter from "./reply.route";
import swaggerRouter from "./swagger.route";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/comment", commentRouter);
router.use("/reply", replyRouter);
router.use("/doc", swaggerRouter);

//Render, don't sleep
router.use("/health", (req, res) => { res.sendStatus(200) });

export default router;