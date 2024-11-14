import { Request, Response } from "express";
import userService from "../services/user.service";

const createUser = async (req: Request, res: Response): Promise<Response | any > => {
    const body = req.body;

    try {
        const { user, token } = await userService.createUserService(body);

        return res.status(201).send({
            message: "User created successfully",
            user,
            token
        });
    } catch (err: any) {
        if (err.message === "Submit all fields for registration")
            return res.status(400).send({ message: err.message });

        if (err.message === "The provided email is already in use")
            return res.status(400).send({ message: err.message });

        if (err.message === "Error creating User")
            return res.status(500).send({ message: "Server error while creating user" });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default { createUser }