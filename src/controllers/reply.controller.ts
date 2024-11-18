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

export default {
    addReplyComment
}