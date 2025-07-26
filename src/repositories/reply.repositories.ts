import { Types, UpdateWriteOpResult } from "mongoose";
import { ICommentNews, ILikeReply, IReplyComment } from "../../custom";
import { CommentModel, LikeReplyModel, ReplyCommentModel } from "../database/db";

const createReplyCommentDataRepositories = (
    dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<IReplyComment | null> =>
    ReplyCommentModel.create({ dataCommentId, commentId, reply: { userId, content } });

const updateCommentDataReplyRepositories = (
    dataCommentId: Types.ObjectId, commentId: Types.ObjectId, newDataReplyId: Types.ObjectId): Promise<ICommentNews | null> =>
    CommentModel.findOneAndUpdate({ _id: dataCommentId, "comment._id": commentId }, { $set: { "comment.$.dataReplyId": newDataReplyId } }, { projection: { _id: 1 } });

const addReplyCommentDataRepositories = (
    commentDataReplyId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<IReplyComment | null> =>
    ReplyCommentModel.findOneAndUpdate({ _id: commentDataReplyId },
        { $push: { reply: [{ userId, content }] } },
        {
            new: true,
            projection: {
                _id: 1,
                reply: { $slice: -1 }
            },
        }
    );

const findOnePreplyRepositories = async (dataReplyId: Types.ObjectId, replyId: Types.ObjectId) => {
    return ReplyCommentModel.aggregate([
        { $match: { _id: dataReplyId } },
        { $unwind: "$reply" },
        { $match: { "reply._id": replyId } },
        {
            $lookup: {
                from: "users",
                localField: "reply.userId",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: 0,
                reply: [{
                    _id: "$reply._id",
                    content: "$reply.content",
                    dataLikeId: "$reply.dataLikeId",
                    likeCount: "$reply.likeCount",
                    createdAt: "$reply.createdAt",
                    documentId: "$_id",
                    user: {
                        _id: "$user._id",
                        username: "$user.username",
                        profilePicture: "$user.profilePicture"
                    }
                }]
            }
        }

    ])
};

const replyCommentsPipelineRepositories = (dataReplyCommentId: Types.ObjectId, userId: Types.ObjectId, offset: number, limit: number): Promise<IReplyComment[] | []> =>
    ReplyCommentModel.aggregate([
        { $match: { _id: dataReplyCommentId } },
        { $unwind: { path: "$reply" } },
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
            $lookup: {
                from: "likeReply",
                let: { replyId: "$reply._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$replyCommentId", "$$replyId"] },
                                    { $in: [userId, "$likes.userId"] }
                                ]
                            }
                        }
                    }
                ],
                as: "likeStatus"
            }
        },
        {
            $addFields: {
                "reply.user": {
                    _id: "$user._id",
                    username: "$user.username",
                    profilePicture: "$user.profilePicture",
                },
                "reply.documentId": "$_id",
                "reply.isLiked": { $gt: [{ $size: "$likeStatus" }, 0] }
            }
        },
        { $replaceRoot: { newRoot: "$reply" } },
        { $sort: { _id: -1 } },
        { $skip: offset },
        { $limit: limit },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                dataLikeId: 1,
                likeCount: 1,
                documentId: 1,
                isLiked: 1,
                likeStatus: 1,
                "user._id": 1,
                "user.username": 1,
                "user.profilePicture": 1,
            },
        },
    ]
);

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
    findOnePreplyRepositories,
    replyCommentsPipelineRepositories,
    findReplyByIdRepositories,
    deleteReplyCommentRepositories,
    createLikeReplyDataRepositories,
    updateReplyDataLikeRepositories,
    isUserInLikeReplyArray,
    likeReplyRepositories,
    deleteLikeReplyRepositories
}