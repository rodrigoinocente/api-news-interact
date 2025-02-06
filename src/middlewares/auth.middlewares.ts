import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import userRepositories from "../repositories/user.repositories";
import { Types } from "mongoose";

const authMiddleware = (req: Request, res: Response, next: NextFunction):  Response | any => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401);

        jwt.verify(token, process.env.SECRET_JWT as string, async (error: any, decoded: any) => {
            if (error) return res.status(401).send({ message: "Token invalid" });

            const user = await userRepositories.findByIdRepositories(decoded.id);
            if (!user || !user._id) return res.status(401).send({ message: "User not found" });

            res.locals.userLoggedId = new Types.ObjectId(user._id);
            next();
        });
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    };
};

export { authMiddleware };