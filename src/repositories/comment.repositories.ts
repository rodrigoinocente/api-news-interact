import { Types } from "mongoose";
import { ICommentNews } from "../../custom";
import { CommentModel } from "../database/db";

const findCommentsByNewsId = (newsId: Types.ObjectId): Promise<ICommentNews[] | []> => {
    return CommentModel.aggregate([
        { $match: { newsId: newsId, }, },
        { $project: { _id: 1, newsId: 1, }, },
    ])
};

const createCommentDataRepositories = (newsId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews> =>
    CommentModel.create({ newsId, comment: [{ userId, content }] });

const upDateCommentDataRepositories = (dataCommentId: Types.ObjectId, userId: Types.ObjectId, content: string): Promise<ICommentNews | null> =>
    CommentModel.findOneAndUpdate({ _id: dataCommentId }, { $push: { comment: [{ userId, content }] } }, {select: "_id"});

export default {
    createCommentDataRepositories,
    findCommentsByNewsId,
    upDateCommentDataRepositories
}