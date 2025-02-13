import { Request, Response } from "express";
import userService from "../services/user.service";

const createUser = async (req: Request, res: Response): Promise<Response | any> => {
    const body = req.body;

    try {
        const { createdUser, token } = await userService.createUserService(body);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 86400000
        });

        const { password: pwd, ...userWithoutPassword } = createdUser.toObject();
        return res.status(201).send(userWithoutPassword);
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

const update = async (req: Request, res: Response): Promise<Response | any> => {
    const userToFoundId = res.locals.userId;
    const userLoggedId = res.locals.userLoggedId;
    const body = req.body;

    try {
        const user = await userService.updateService(userToFoundId, userLoggedId, body);

        return res.status(200).send({ message: "User successfully updated", user });

    } catch (err: any) {
        if (err.message === "Submit at least one fields for update")
            return res.status(400).send({ message: err.message });

        if (err.message === "You didn't update this user")
            return res.status(403).send({ message: err.message });

        if (err.message === "The provided email is already in use")
            return res.status(400).send({ message: err.message });

        if (err.message === "User not found by ID")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

const getLoggedInUser = async (req: Request, res: Response): Promise<Response | any> => {
    const userLoggedId = res.locals.userLoggedId;

    try {
        const user = await userService.findByIdService(userLoggedId);

        return res.status(200).send(user);
    } catch (err: any) {
        if (err.message === "User not found by id")
            return res.status(404).send({ message: err.message });

        return res.status(500).send({ message: "An unexpected error occurred" });
    };
};

export default {
    createUser,
    update,
    getLoggedInUser
}