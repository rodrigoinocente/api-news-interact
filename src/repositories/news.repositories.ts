import { IUser } from "../../custom";
import { UserModel } from "../database/db";

const createRepositories = (body: IUser): Promise<IUser> => UserModel.create(body);

const findByEmailRepositories = (email: string): Promise<IUser | null> => UserModel.findOne({ email: email });

export default {
    createRepositories,
    findByEmailRepositories
};