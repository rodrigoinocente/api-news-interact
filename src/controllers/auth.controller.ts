import authService from "../services/auth.service";
import { Request, Response } from "express"

const login = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginService(email, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 86400000
        });
        const { password: pwd, ...userWithoutPassword } = user.toObject();
         res.status(200).send(userWithoutPassword);
    } catch (err: any) {
        if (err.message === "Email or Password not found")
            return res.status(400).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const logout = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        res.status(200).send({ message: "Concluido" });
    } catch (err: any) {

        return res.status(500).send({ message: "An unexpected error occurred" });
    }
};

export default { login, logout };