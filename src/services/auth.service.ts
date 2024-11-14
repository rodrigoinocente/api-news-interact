import bcrypt from "bcrypt";
import { IUser } from "../../custom";
import authRepositories from "../repositories/auth.repositories";

const loginService = async (email: string, password: string) => {
        const user: IUser | null = await authRepositories.loginService(email);
        if (!user)  throw new Error("Email or Password not found");

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) throw new Error("Email or Password not found");

        const token = authRepositories.generateToken(user._id);

      return token;
};

export default { loginService };