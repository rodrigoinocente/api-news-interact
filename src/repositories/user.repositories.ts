import { Types } from "mongoose";
import { IUser } from "../../custom";
import { UserModel } from "../database/db";

const createRepositories = (body: IUser): Promise<IUser> => UserModel.create(body);

const findByEmailRepositories = (email: string): Promise<IUser | null> => UserModel.findOne({ email: email });

const updateRepositories = (userId:  Types.ObjectId, body: IUser): Promise<IUser | null> => UserModel.findOneAndUpdate(
    { _id: userId },
    {...body }, { new: true }
);

const findByIdRepositories = (userId: Types.ObjectId): Promise<IUser | null> => UserModel.findById(userId);

export default {
    createRepositories,
    findByEmailRepositories,
    updateRepositories,
    findByIdRepositories
};