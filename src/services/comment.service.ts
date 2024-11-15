import { Types } from "mongoose";
import { ICommentNews } from "../../custom";
import commentRepositories from "../repositories/comment.repositories";

const addCommentService = async (newsId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews> => {
    if (!content) throw new Error("Write a message to comment");

    console.log("content: ", content);
    const findComments = await commentRepositories.findCommentsByNewsId(newsId)
    if (findComments.length === 0) {
        const createdDataComment = await commentRepositories.createCommentDataRepositories(newsId, userId, content);
        if (!createdDataComment) throw new Error("Failed to create comment");

        return createdDataComment;
    } else {
        const upDateComment = await commentRepositories.upDateCommentDataRepositories(findComments[0]._id, userId, content);
        console.log("upDateComment: ", upDateComment);
        if (!upDateComment) throw new Error("Failed to create comment");

        return upDateComment;
    }
};

export default {
    addCommentService
}