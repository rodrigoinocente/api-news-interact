import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import UserSchema from "../models/User";
import { ICommentNews, ILikeComment, ILikeReply, IReplyComment, IUser } from "../../custom"
import CommentSchema from "../models/Comment";
import LikeCommentSchema from "../models/LikeComment";
import ReplyCommentSchema from "../models/ReplyComment";
import LikeReplySchema from "../models/LikeReply";


const connectDb = mongoose.createConnection(process.env.INTERACT_MONGODB_URI as string);

export const UserModel = connectDb.model<IUser>("User", UserSchema, "users");
export const CommentModel = connectDb.model<ICommentNews>("Comment", CommentSchema, "comments");
export const LikeCommentModel = connectDb.model<ILikeComment>("LikeComment", LikeCommentSchema, "likesComment");
export const ReplyCommentModel = connectDb.model<IReplyComment>("ReplyComment", ReplyCommentSchema, "replyComment");
export const LikeReplyModel = connectDb.model<ILikeReply>("LikeReply", LikeReplySchema, "likeReply");