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

interface Paginated {
  nextUrl: string | null;
  previousUrl: string | null;
  offset: number;
  total: number;
  comments?: ICommentNews[];
  replies?: IReplyComment[];
};

export interface ILikeReply {
  _id: Types.ObjectId;
  dataReplyCommentId: Types.ObjectId;
  replyCommentId: Types.ObjectId;
  likes: Like[];
};

interface Like {
  userId: Types.ObjectId;
  createdAt: Date;
};

export interface ILikeComment {
  _id: Types.ObjectId;
  dataCommentId: Types.ObjectId;
  commentId: Types.ObjectId;
  likes: Like[];
};

interface Like {
  userId: Types.ObjectId;
  createdAt: Date;
};

export interface IReplyComment {
  _id: Types.ObjectId;
  dataCommentId: Types.ObjectId;
  commentId: Types.ObjectId;
  reply: Reply[];
};