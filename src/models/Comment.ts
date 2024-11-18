import mongoose from "mongoose";
import { ICommentNews, IUpdateTypeComment } from "../../custom";
import commentRepositories from "../repositories/comment.repositories";
import { LikeCommentModel, LikeReplyModel, ReplyCommentModel } from "../database/db";

const CommentSchema = new mongoose.Schema<ICommentNews>({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "News",
    required: true,
  },
  comment: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        dataLikeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "LikeComment",
          default: null,
        },
        dataReplyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ReplyComment",
          default: null,
        },
        likeCount: {
          type: Number,
          default: 0,
        },
        replyCount: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
          required: true,
        },
      },
    ],
  },
});

CommentSchema.pre("updateMany", async function (next) {
  const { _id: dataCommentId } = this.getQuery();
  const getCommentId = this.getUpdate() as IUpdateTypeComment | null;
  if (getCommentId?.$pull?.comment) {
    const { $pull: { comment: { _id: commentId } } } = getCommentId;
    
    const comment: ICommentNews | null = await commentRepositories.findCommentByIdRepositories(dataCommentId, new mongoose.Types.ObjectId(commentId));
    if (comment) {
      if (comment.comment[0].dataLikeId) await LikeCommentModel.deleteOne(comment.comment[0].dataLikeId);
      if (comment.comment[0].dataReplyId) {
        const replies = await ReplyCommentModel.findById(comment.comment[0].dataReplyId);
        if (replies) {
          for (const reply of replies.reply)
            if (reply.dataLikeId) await LikeReplyModel.deleteOne(reply.dataLikeId);

          await ReplyCommentModel.deleteOne(comment.comment[0].dataReplyId);
        }
      }
    }
  }
  next();
});

export default CommentSchema;