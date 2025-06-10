import { Types } from "mongoose";
import { IUser } from "../../custom";
import { UserModel } from "../database/db";
import jwt from "jsonwebtoken";

const loginService = (email: string): Promise<IUser | null> => UserModel.findOne({ email: email }).select("+password");

const generateToken = (id: Types.ObjectId): string => jwt.sign({ id: id }, process.env.INTERACT_SECRET_JWT as any, { expiresIn: 86400 });

export default {
    loginService,
    generateToken
};