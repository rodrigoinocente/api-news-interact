import { Types } from "mongoose";
import { ICommentNews, Paginated } from "../../custom";
import commentRepositories from "../repositories/comment.repositories";

const addCommentService = async (newsId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews> => {
    if (!content) throw new Error("Write a message to comment");

    const findComments = await commentRepositories.findCommentsByNewsId(newsId)
    if (findComments.length === 0) {
        const createdDataComment = await commentRepositories.createCommentDataRepositories(newsId, userId, content);
        if (!createdDataComment) throw new Error("Failed to create comment");

        return createdDataComment;
    } else {
        const upDateComment = await commentRepositories.upDateCommentDataRepositories(findComments[0]._id, userId, content);
        if (!upDateComment) throw new Error("Failed to create comment");

        return upDateComment;
    }
};

const getPaginatedCommentsService = async (newsId: Types.ObjectId, limit: number, offset: number, currentUrl: string): Promise<Paginated> => {
    let total: number
    //TODO: make the total come together with the newsId
    const comments: ICommentNews[] = await commentRepositories.commentsPipelineRepositories(newsId, offset, limit);
    if (comments.length === 0)
        throw new Error("There are no registered comments")

    const totalComments = await commentRepositories.totalCommentsRepositories(newsId)
    if (totalComments) total = totalComments[0].commentCount 
    else  total = 10000 

    const next = offset + limit;
    const nextUrl = next < total ? `${currentUrl}/commentPage/${newsId}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}/commentPage/${newsId}?limit=${limit}&offset=${previous}` : null;

    return ({
        nextUrl,
        previousUrl,
        offset,
        total,
        comments
    });
};

export default {
    addCommentService,
    getPaginatedCommentsService
}