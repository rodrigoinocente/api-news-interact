import commentService from "../services/comment.service";
import { Request, Response } from "express"

const addComment = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const newsId = res.locals.newsId;
        const userId = res.locals.userLoggedId;
        const { content } = req.body;
        const commentResult = await commentService.addCommentService(newsId, userId, content);

        return res.status(201).send({ message: "Comment successfully completed", comment: commentResult });
    } catch (err: any) {

        if (err.message === "Write a message to comment")
            return res.status(400).send({ message: err.message });

        if (err.message === "Failed to create comment")
            return res.status(500).send({ message: "An unexpected error occurred" });

        return res.status(500).send({ message: "An unexpected error occurred" });
    }
};

const getPaginatedComments = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const newsId = res.locals.newsId;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;
        const currentUrl = req.baseUrl;

        const { nextUrl, previousUrl, total, comments } = await commentService.getPaginatedCommentsService(newsId, limit, offset, currentUrl);

        res.status(200).send({
            nextUrl,
            previousUrl,
            offset,
            total,
            comments
        });
    } catch (err: any) {

        if (err.message === "There are no registered comments")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default {
    addComment,
    getPaginatedComments
}