import { Types, UpdateWriteOpResult } from "mongoose";
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
    ReplyCommentModel.findOneAndUpdate({ _id: commentDataReplyId }, { $push: { reply: [{ userId, content }] } }, { select: "_id" });

const replyCommentsPipelineRepositories = (dataReplyCommentId: Types.ObjectId, offset: number, limit: number): Promise<IReplyComment[] | []> => {
    return ReplyCommentModel.aggregate([
        { $match: { _id: dataReplyCommentId } },
        { $unwind: { path: "$reply" } },
        { $sort: { "reply.createdAt": -1 } },
        { $skip: offset },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "reply.userId",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: { path: "$user" } },
        {
            $project: {
                "user.name": 1,
                "user.username": 1,
                "user.email": 1,
                "reply.content": 1,
                "reply.dataLikeId": 1,
                "reply.likeCount": 1,
                "reply.createdAt": 1,
                "reply._id": 1,
                "_id": 1,
            },
        },
    ]
    );
};

const findReplyByIdRepositories = (dataReplyId: Types.ObjectId, replyId: Types.ObjectId): Promise<IReplyComment | null> =>
    ReplyCommentModel.findOne({ _id: dataReplyId, "reply._id": replyId }, { "reply.$": 1 })

const deleteReplyCommentRepositories = (dataReplyId: Types.ObjectId, replyId: Types.ObjectId): Promise<UpdateWriteOpResult | void> =>
    ReplyCommentModel.updateMany({ _id: dataReplyId }, { $pull: { reply: { _id: replyId } } });

export default {
    createReplyCommentDataRepositories,
    updateCommentDataReplyRepositories,
    addReplyCommentDataRepositories,
    replyCommentsPipelineRepositories,
    findReplyByIdRepositories,
    deleteReplyCommentRepositories
}