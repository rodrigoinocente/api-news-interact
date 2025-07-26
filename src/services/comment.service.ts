import { Types } from "mongoose";
import { ICommentNews, Paginated } from "../../custom";
import commentRepositories from "../repositories/comment.repositories";

const addCommentService = async (newsId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews> => {
    if (!content) throw new Error("Write a message to comment");
    let doc: ICommentNews;

    const existComments = await commentRepositories.findCommentsByNewsId(newsId)
    if (existComments.length === 0) {
        const createdDataComment = await commentRepositories.createCommentDataRepositories(newsId, userId, content);

        doc = createdDataComment;
    } else {
        const upDateComment = await commentRepositories.upDateCommentDataRepositories(existComments[0]._id, userId, content);

        doc = upDateComment;
    }

    const formattedComment = await commentRepositories.findOneComment(doc._id, doc.comment[0]._id);
    if (!formattedComment) throw new Error("Failed to retrieve the new comment");

    return formattedComment[0]
};

const getPaginatedCommentsService = async (newsId: Types.ObjectId, userId: Types.ObjectId, limit: number, offset: number): Promise<Paginated> => {
    const comments: ICommentNews[] = await commentRepositories.commentsPipelineRepositories(newsId, userId, offset, limit);
    const totalResult = await commentRepositories.totalCommentsRepositories(newsId);

    const total = totalResult[0]?.commentCount ?? 0;

    const next = offset + limit;
    const hasMore = next < total ? true : false;
    const nextOffset = next

    return ({
        hasMore,
        nextOffset,
        comments
    });
};

const deleteCommentService = async (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId): Promise<void> => {
    const comment: ICommentNews | null = await commentRepositories.findCommentByIdRepositories(dataCommentId, commentId)
    if (!comment)
        throw new Error("Comment not found");

    if (comment.comment[0].userId.toString() !== userId.toString())
        throw new Error("You can't delete this comment")

    const commentDelete = await commentRepositories.deleteCommentRepositories(dataCommentId, commentId)
    if (!commentDelete)
        throw new Error("Failed to delete comment")
};

const likeCommentService = async (dataCommentId: Types.ObjectId, commentId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const comment = await commentRepositories.findCommentByIdRepositories(dataCommentId, commentId);
    if (!comment) throw new Error("Comment not found")

    const commentDataLikeId = comment.comment[0].dataLikeId;
    if (!commentDataLikeId) {
        const newDataLike = await commentRepositories.createLikeCommentDataRepositories(dataCommentId, commentId, userId);
        if (!newDataLike) throw new Error("An unexpected error occurred");

        const updateCommentDataLikeId = await commentRepositories.updateCommentDataLikeId(dataCommentId, commentId, newDataLike._id)
        if (!updateCommentDataLikeId) throw new Error("An unexpected error occurred");

        return await checkLikeComment(newDataLike._id, userId);
    }

    const isLiked = await commentRepositories.isUserInLikeCommentArray(commentDataLikeId, userId);
    if (!isLiked) {
        await commentRepositories.likeCommentRepositories(commentDataLikeId, userId);

        return await checkLikeComment(commentDataLikeId, userId);
    } else {
        await commentRepositories.deleteLikeCommentRepositories(commentDataLikeId, userId);

        return await checkLikeComment(commentDataLikeId, userId);
    }
};

const checkLikeComment = async (commentDataLike: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> => {
    const checkLike = await commentRepositories.isUserInLikeCommentArray(commentDataLike, userId)
    if (checkLike) return true
    else return false
};

export default {
    addCommentService,
    getPaginatedCommentsService,
    deleteCommentService,
    likeCommentService
}