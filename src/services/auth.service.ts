import bcrypt from "bcrypt";
import { IUser } from "../../custom";
import authRepositories from "../repositories/auth.repositories";

const loginService = async (email: string, password: string) => {
        const user: IUser | null = await authRepositories.loginService(email);
        if (!user)  throw new Error("E-mail ou senha não encontrados");

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) throw new Error("E-mail ou senha não encontrados");

        const token = authRepositories.generateToken(user._id);

      return {user, token};
};

export default { loginService };