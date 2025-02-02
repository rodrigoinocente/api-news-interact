import { Router } from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { validateAndConvertIds } from "../middlewares/global.middlewares";

const router = Router();

router.post("/", userController.createUser);
router.patch("/:userId", authMiddleware, validateAndConvertIds, userController.update);
router.get("/me/", authMiddleware, userController.getLoggedInUser);

export default router;