import { Types, UpdateWriteOpResult } from "mongoose";
import { ICommentNews, ILikeComment } from "../../custom";
import { CommentModel, LikeCommentModel } from "../database/db";

const findCommentsByNewsId = (newsId: Types.ObjectId): Promise<ICommentNews[] | []> => {
    return CommentModel.aggregate([
        { $match: { newsId: newsId, }, },
        { $project: { _id: 1, newsId: 1, }, },
    ])
};

const createCommentDataRepositories = (newsId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews> =>
    CommentModel.create({ newsId, comment: [{ userId, content }] });

const upDateCommentDataRepositories = (dataCommentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews | null> =>
    CommentModel.findOneAndUpdate({ _id: dataCommentId }, { $push: { comment: [{ userId, content }] } }, { select: "_id" });

const commentsPipelineRepositories = (newsId: Types.ObjectId, offset: number, limit: number): Promise<ICommentNews[] | []> => {
    return CommentModel.aggregate([
        { $match: { newsId: newsId } },
        { $unwind: { path: "$comment" } },
        { $sort: { "comment.createdAt": -1 } },
        { $skip: offset },
        { $limit: limit },
        {
            $lookup: {
                from: "users",
                localField: "comment.userId",
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
                "comment.content": 1,
                "comment.dataLikeId": 1,
                "comment.dataReplyId": 1,
                "comment.likeCount": 1,
                "comment.replyCount": 1,
                "comment.createdAt": 1,
                "comment._id": 1,
                "_id": 1,
            },
        },
    ]
    );
};

const totalCommentsRepositories = (newsId: Types.ObjectId) => {
    return CommentModel.aggregate([
        { $match: { newsId: newsId, }, },
        { $project: { _id: 0, commentCount: { $size: "$comment", }, }, },
    ])
}

const findCommentByIdRepositories = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId): Promise<ICommentNews | null> =>
    CommentModel.findOne({ _id: dataCommentId, "comment._id": commentId }, { "comment.$": 1 });

const deleteCommentRepositories = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId): Promise<UpdateWriteOpResult | null> =>
    CommentModel.updateMany({ _id: dataCommentId }, { $pull: { comment: { _id: commentId } } });

const createLikeCommentDataRepositories = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeComment | null> =>
    LikeCommentModel.create({ dataCommentId, commentId, likes: { userId } });

const updateCommentDataLikeId = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, dataLikeCommentId: Types.ObjectId): Promise<ICommentNews | null> =>
    CommentModel.findOneAndUpdate({ _id: dataCommentId, "comment._id": commentId }, { $set: { "comment.$.dataLikeId": dataLikeCommentId } });

const isUserInLikeCommentArray = (dataLikeCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<object | null> =>
    LikeCommentModel.exists({ _id: dataLikeCommentId, "likes.userId": [userId] });

const likeCommentRepositories = (dataLikeCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeComment | null> => LikeCommentModel.findOneAndUpdate(
    { _id: dataLikeCommentId }, { $push: { likes: { userId } } }, { select: "_id" });

const deleteLikeCommentRepositories = (dataLikeCommentId: Types.ObjectId, userId: Types.ObjectId): Promise<ILikeComment | null> =>
    LikeCommentModel.findOneAndUpdate({ _id: dataLikeCommentId }, { $pull: { likes: { userId } } }, { select: "_id" });

export default {
    createCommentDataRepositories,
    findCommentsByNewsId,
    upDateCommentDataRepositories,
    commentsPipelineRepositories,
    totalCommentsRepositories,
    findCommentByIdRepositories,
    deleteCommentRepositories,
    createLikeCommentDataRepositories,
    updateCommentDataLikeId,
    isUserInLikeCommentArray,
    likeCommentRepositories,
    deleteLikeCommentRepositories
}