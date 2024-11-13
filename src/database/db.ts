import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from "../models/User";
import { IUser } from "../../custom"

const connectDb = mongoose.createConnection(process.env.MONGODB_URI as string);

export const UserModel = connectDb.model<IUser>("User", UserSchema, "users");