import { Types } from "mongoose";
import { ICommentNews, IReplyComment, Paginated } from "../../custom";
import commentRepositories from "../repositories/comment.repositories";
import replyRepositories from "../repositories/reply.repositories";

const addReplyCommentService = async (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<IReplyComment> => {
    if (!content)
        throw new Error("Write a message to reply")

    const comment: ICommentNews | null = await commentRepositories.findCommentByIdRepositories(dataCommentId, commentId);
    if (!comment) throw new Error("Comment not found")

    const commentDataReplyId = comment.comment[0].dataReplyId;
    if (!commentDataReplyId) {
        const newDataReply = await replyRepositories.createReplyCommentDataRepositories(dataCommentId, commentId, userId, content);
        if (!newDataReply) throw new Error("Failed to create reply")

        const updateCommentDataReply = await replyRepositories.updateCommentDataReplyRepositories(dataCommentId, commentId, newDataReply._id);
        if (!updateCommentDataReply) throw new Error("Failed to create reply")

        return newDataReply;
    } else {
        const newReply = await replyRepositories.addReplyCommentDataRepositories(commentDataReplyId, userId, content);
        console.log("newReply: ", newReply);
        if (!newReply) throw new Error("Failed to add response")

        return newReply;
    }
};

export default {
    addReplyCommentService
}