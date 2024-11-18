import { Types, UpdateWriteOpResult } from "mongoose";
import { ICommentNews, ILikeReply, IReplyComment } from "../../custom";
import { CommentModel, LikeReplyModel, ReplyCommentModel } from "../database/db";

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

const createLikeReplyDataRepositories = async (
    dataReplyCommentId: Types.ObjectId, replyCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeReply | null> =>
    LikeReplyModel.create({ dataReplyCommentId, replyCommentId, likes: { userId } });

const updateReplyDataLikeRepositories = (dataReplyCommentId: Types.ObjectId, replyCommentId: Types.ObjectId, dataLikeId: Types.ObjectId) =>
    ReplyCommentModel.findOneAndUpdate({ _id: dataReplyCommentId, "reply._id": replyCommentId }, { $set: { "reply.$.dataLikeId": dataLikeId } });

const isUserInLikeReplyArray = (replyDataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<object | null> =>
    LikeReplyModel.exists({ _id: replyDataLikeId, "likes.userId": [userId] });

const likeReplyRepositories = (replyDataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeReply | null> =>
    LikeReplyModel.findOneAndUpdate({ _id: replyDataLikeId }, { $push: { likes: { userId } } });

const deleteLikeReplyRepositories = (replyDataLikeId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeReply | null> =>
    LikeReplyModel.findOneAndUpdate({ _id: replyDataLikeId }, { $pull: { likes: { userId } } });

export default {
    createReplyCommentDataRepositories,
    updateCommentDataReplyRepositories,
    addReplyCommentDataRepositories,
    replyCommentsPipelineRepositories,
    findReplyByIdRepositories,
    deleteReplyCommentRepositories,
    createLikeReplyDataRepositories,
    updateReplyDataLikeRepositories,
    isUserInLikeReplyArray,
    likeReplyRepositories,
    deleteLikeReplyRepositories
}