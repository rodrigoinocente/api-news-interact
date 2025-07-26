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
  CommentModel.create({ newsId, comment: [{ userId, content }], new: true });

const upDateCommentDataRepositories = async (dataCommentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews> => {
  const updateResult = await CommentModel.findOneAndUpdate(
    { _id: dataCommentId },
    {
      $push: {
        comment: {
          userId,
          content
        }
      }
    },
    {
      new: true,
      projection: {
        _id: 1,
        newsId: 1,
        comment: { $slice: -1 }
      }
    }
  );

  if (!updateResult || !updateResult.comment || !updateResult.comment[0]) {
    throw new Error("Comentário não foi adicionado.");
  }

  return updateResult;
};

const commentsPipelineRepositories = (
  newsId: Types.ObjectId,
  userId: Types.ObjectId | null,
  offset: number,
  limit: number
): Promise<ICommentNews[] | []> =>
  CommentModel.aggregate([
    { $match: { newsId } },
    { $unwind: "$comment" },
    {
      $lookup: {
        from: "users",
        localField: "comment.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "likesComment",
        let: { commentId: "$comment._id" },
        pipeline: [
          { 
            $match: {
              $expr: { 
                $and: [
                  { $eq: ["$commentId", "$$commentId"] },
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
        "comment.user": {
          _id: "$user._id",
          username: "$user.username",
          profilePicture: "$user.profilePicture",
        },
        "comment.documentId": "$_id",
        "comment.isLiked": { $gt: [{ $size: "$likeStatus" }, 0] }
      },
    },
    { $replaceRoot: { newRoot: "$comment" } },
    { $sort: { _id: -1 } },
    { $skip: offset },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        documentId: 1,
        content: 1,
        createdAt: 1,
        dataLikeId: 1,
        dataReplyId: 1,
        likeCount: 1,
        replyCount: 1,
        isLiked: 1,
        "user._id": 1,
        "user.username": 1,
        "user.profilePicture": 1,
      },
    },
  ]);
  
const totalCommentsRepositories = (newsId: Types.ObjectId) => {
  return CommentModel.aggregate([
    { $match: { newsId: newsId, }, },
    { $project: { _id: 0, commentCount: { $size: "$comment", }, }, },
  ])
}

const findCommentByIdRepositories = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId): Promise<ICommentNews | null> =>
  CommentModel.findOne({ _id: dataCommentId, "comment._id": commentId }, { "comment.$": 1 });

const findOneComment = (dataCommentId: Types.ObjectId, commentId: Types.ObjectId) => {
  return CommentModel.aggregate([
    { $match: { _id: dataCommentId } },
    { $unwind: "$comment" },
    { $match: { "comment._id": commentId } },
    {
      $lookup: {
        from: "users",
        localField: "comment.userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        newsId: 1,
        comment: [{
          _id: "$comment._id",
          content: "$comment.content",
          dataLikeId: "$comment.dataLikeId",
          dataReplyId: "$comment.dataReplyId",
          likeCount: "$comment.likeCount",
          replyCount: "$comment.replyCount",
          createdAt: "$comment.createdAt",
          documentId: "$_id",
          user: {
            _id: "$user._id",
            username: "$user.username",
            profilePicture: "$user.profilePicture"
          }
        }]
      }
    }
  ]);
};

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
  findOneComment,
  deleteCommentRepositories,
  createLikeCommentDataRepositories,
  updateCommentDataLikeId,
  isUserInLikeCommentArray,
  likeCommentRepositories,
  deleteLikeCommentRepositories
}