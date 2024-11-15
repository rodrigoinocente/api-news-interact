import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from "../models/User";
import { ICommentNews, IUser } from "../../custom"
import CommentSchema from "../models/Comment";

const connectDb = mongoose.createConnection(process.env.MONGODB_URI as string);

export const UserModel = connectDb.model<IUser>("User", UserSchema, "users");
export const CommentModel = connectDb.model<ICommentNews>("Comment", CommentSchema, "comments");