import { Request, Response } from "express"
import replyService from "../services/reply.service";

const addReplyComment = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const dataCommentId = res.locals.dataCommentId;
        const commentId = res.locals.commentId;
        const userId = res.locals.userLoggedId;
        const { content } = req.body;

        const reply = await replyService.addReplyCommentService(dataCommentId, commentId, userId, content);
        res.status(200).send({
            message: "Reply successfully completed",
            reply
        });

    } catch (err: any) {
        if (err.message === "Comment not found")
            return res.status(204).send();

        if (err.message === "Write a message to reply")
            return res.status(400).send({ message: err.message });

        if (err.message === "Failed to create reply")
            return res.status(500).send({ message: "An unexpected error occurred" });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const getPaginatedReply = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const dataCommentId = res.locals.dataCommentId;
        const commentId = res.locals.commentId;
        let limit = req.query.limit ? Number(req.query.limit) : 10;
        let offset = req.query.offset ? Number(req.query.offset) : 0;
        const currentUrl = req.baseUrl;

        const { nextUrl, previousUrl, total, replies } = await replyService.getPaginatedReplyService(dataCommentId, commentId, limit, offset, currentUrl)

        res.status(200).send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            replies
        });
    } catch (err: any) {
        if (err.message === "Comment not found")
            return res.status(204).send();

        if (err.message === "Failed to retrieve replies")
            return res.status(500).send({ message: err.message });

        if (err.message === "There are no registered replies")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const deleteReply = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const dataReplyId = res.locals.dataReplyId;
        const replyId = res.locals.replyId;
        const userId = res.locals.userLoggedId;

        await replyService.deleteReplyService(dataReplyId, replyId, userId);

        res.status(200).send({ message: "Reply successfully removed" });
    } catch (err: any) {
        if (err.message === "Reply not found")
            return res.status(204).send();

        if (err.message === "You can't delete this reply")
            return res.status(403).send({ message: err.message });

        if (err.message === "Failed to delete reply")
            return res.status(500).send({ message: "An unexpected error occurred" });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const likeReply = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const dataReplyId = res.locals.dataReplyId;
        const replyId = res.locals.replyId;
        const userId = res.locals.userLoggedId;

        const isLike = await replyService.likeReplyService(dataReplyId, replyId, userId);

        return res.status(200).send(isLike);

    } catch (err: any) {
        if (err.message === "Reply not found")
            return res.status(204).send();

        if (err.message === "An unexpected error occurred")
            return res.status(500).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default {
    addReplyComment,
    getPaginatedReply,
    deleteReply,
    likeReply
}