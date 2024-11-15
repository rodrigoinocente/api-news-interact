import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
};

export interface ICommentNews {
  _id: Types.ObjectId;
  newsId: Types.ObjectId;
  comment: IComment[];
};

interface IComment {
  newsId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  dataLikeId: Types.ObjectId;
  dataReplyId: Types.ObjectId;
  likeCount: number;
  replyCount: number;
  createdAt: Date;
};