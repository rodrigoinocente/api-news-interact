import mongoose from "mongoose";
import { CommentModel, LikeCommentModel } from "../database/db";
import { ILikeComment } from "../../custom";

const LikeCommentSchema = new mongoose.Schema({
    dataCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    },
    likes: {
        type: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
                required: true
            },
            _id: false
        }]
    },
});

LikeCommentSchema.post('save', async function () {
    await CommentModel.updateOne({ _id: this.dataCommentId, "comment._id": this.commentId },
        { $set: { "comment.$.likeCount": this.likes.length } });
});

LikeCommentSchema.post('findOneAndUpdate', async function () {
    const dataLikesId = this.getQuery();
    const dataLikesUpdate: ILikeComment | null = await LikeCommentModel.findById(dataLikesId);
    if (dataLikesUpdate) {
        await CommentModel.updateOne({ _id: dataLikesUpdate.dataCommentId, "comment._id": dataLikesUpdate.commentId },
            { $set: { "comment.$.likeCount": dataLikesUpdate.likes.length } });
    }
});

export default LikeCommentSchema;