import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";

const isValidObjectId = (id: string): boolean => Types.ObjectId.isValid(id);

const validateAndConvertIds = (req: Request, res: Response, next: NextFunction): Response | any => {
    const paramNames = ["newsId", "dataCommentId", "commentId", "dataReplyId", "replyId", "userId"];

    try {
        paramNames.forEach(param => {
            const paramValue = req.params[param];
            if (paramValue) {

                if (!isValidObjectId(paramValue))
                    return res.status(400).send({ message: `Invalid ${param}` });

                res.locals[param] = new Types.ObjectId(paramValue);
            }
        });

        next();
    } catch (err) {
        return res.status(500).send({ message: "An error occurred while processing the ID(s)" });
    }
};

export { validateAndConvertIds };
