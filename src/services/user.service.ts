import userRepositories from "../repositories/news.repositories";
import { IUser } from "../../custom";
import authRepositories from "../repositories/auth.repositories";

const createUserService = async (body: IUser): Promise<{ user: Omit<IUser, "password">; token: string }> => {
    const { name, username, email, password } = body;
    if (!name || !username || !email || !password)
        throw new Error("Submit all fields for registration");

    const isEmailInUse = await userRepositories.findByEmailRepositories(email);
    if (isEmailInUse) throw new Error("The provided email is already in use");

    const createdUser: IUser = await userRepositories.createRepositories(body);
    if (!createdUser) throw new Error("Error creating User")

    const token = authRepositories.generateToken(createdUser._id)

    return {
        user: {
            _id: createdUser._id,
            name: createdUser.name,
            username: createdUser.username,
            email: createdUser.email
        },
        token
    };
};

export default {createUserService}
