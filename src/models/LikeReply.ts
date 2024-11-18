import mongoose from "mongoose";

const LikeReplySchema = new mongoose.Schema({
    dataReplyCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReplyComment",
        required: true,
    },
    replyCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReplyComment",
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
        }]
    },
});

export default LikeReplySchema;