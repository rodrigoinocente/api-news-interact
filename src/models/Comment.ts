import mongoose from "mongoose";
import { ICommentNews } from "../../custom";

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

export default CommentSchema;