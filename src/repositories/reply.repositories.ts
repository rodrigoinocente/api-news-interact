import { Types } from "mongoose";
import { ICommentNews, IReplyComment } from "../../custom";
import { CommentModel, ReplyCommentModel } from "../database/db";

const createReplyCommentDataRepositories = (
    dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<IReplyComment | null> =>
    ReplyCommentModel.create({ dataCommentId, commentId, reply: { userId, content } });

const updateCommentDataReplyRepositories = (
    dataCommentId: Types.ObjectId, commentId: Types.ObjectId, newDataReplyId: Types.ObjectId): Promise<ICommentNews | null> =>
    CommentModel.findOneAndUpdate({ _id: dataCommentId, "comment._id": commentId }, { $set: { "comment.$.dataReplyId": newDataReplyId } });

const addReplyCommentDataRepositories = (
    commentDataReplyId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<IReplyComment | null> =>
    ReplyCommentModel.findOneAndUpdate({ _id: commentDataReplyId }, { $push: { reply: [{ userId, content }] } }, { select: "_id"});

export default {
    createReplyCommentDataRepositories,
    updateCommentDataReplyRepositories,
    addReplyCommentDataRepositories
}