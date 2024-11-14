import authService from "../services/auth.service";
import { Request, Response } from "express"

const login = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { email, password } = req.body;

        const token = await authService.loginService(email, password);

        res.status(200).send({token});
    } catch (err: any) {
        if (err.message === "Email or Password not found")
            return res.status(400).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default { login };