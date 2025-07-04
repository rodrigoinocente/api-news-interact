import userRepositories from "../repositories/user.repositories";
import { IUser } from "../../custom";
import authRepositories from "../repositories/auth.repositories";
import { Types } from "mongoose";
import bcrypt from "bcrypt";

const createUserService = async (body: IUser): Promise<{ createdUser: IUser; token: string }> => {
    const { name, username, email, password } = body;
    if (!name || !username || !email || !password)
        throw new Error("Submit all fields for registration");

    const isEmailInUse = await userRepositories.findByEmailRepositories(email);
    if (isEmailInUse) throw new Error("Este e-mail já está cadastrado");

    const createdUser: IUser = await userRepositories.createRepositories(body);
    if (!createdUser) throw new Error("Error creating User")
        
    const token = authRepositories.generateToken(createdUser._id)

    return { createdUser, token };
};

const updateService = async (userToFoundId: Types.ObjectId, userLoggedId: Types.ObjectId, body: IUser): Promise<Omit<IUser, "password">> => {
    let { name, username, email, password, profilePicture } = body;
    if (!name && !username && !email && !password && !profilePicture) throw new Error("Submit at least one fields for update")

    if (userToFoundId.toString() !== userLoggedId.toString()) throw new Error("You didn't update this user");

    if (email) {
        const isEmailInUse = await userRepositories.findByEmailRepositories(email);
        if (isEmailInUse) throw new Error("O e-mail fornecido já está em uso.");
    }

    await findByIdService(userToFoundId);

    if (password) body.password = await bcrypt.hash(password, 10)

    const userUpdate = await userRepositories.updateRepositories(userLoggedId, body);
    if (!userUpdate) throw new Error("Error updating");

    return userUpdate
};

const findByIdService = async (userId: Types.ObjectId): Promise<IUser> => {
    const user = await userRepositories.findByIdRepositories(userId)
    if (!user) throw new Error("User not found by ID");

    return user
};

export default {
    createUserService,
    updateService,
    findByIdService
}
