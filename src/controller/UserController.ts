import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import validator from "validator";

import { type User } from "../database/entities/User";
import { env } from "../enviroment";
import { UserRepository } from "../repositories/UserRepository";

const userRepository = new UserRepository();

class UserController {
    read = async (request: Request, response: Response): Promise<Response> => {
        try {
            const result = await userRepository.read();

            return response.send(result);
        } catch (error) {
            return response.status(500).json({
                message: "Internal server error",
            });
        }
    };

    create = async (
        request: Request,
        response: Response,
    ): Promise<Response> => {
        try {
            const { name, email, password }: User = request.body;

            if (!name || !email || !password)
                return response.status(400).json({
                    message: "Missing Data",
                });

            if (!validator.isEmail(email)) {
                return response.status(400).json({
                    message: "Ivalid email",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const result = await userRepository.create({
                name,
                email,
                password: hashPassword,
            });

            return response.status(201).send(result);
        } catch (error) {
            console.log(error);
            return response.status(500).json({
                message: "Internal server error",
            });
        }
    };

    login = async (request: Request, response: Response): Promise<Response> => {
        const { email, password }: User = request.body;

        if (!email || !password)
            return response.status(400).json({
                message: "Password or email is incorrect",
            });

        if (!validator.isEmail(email)) {
            return response.status(400).json({
                message: "Ivalid email",
            });
        }

        const user = await userRepository.findByEmail({ email });

        if (!user) {
            return response.status(400).json({
                message: "Password or email is incorrect",
            });
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return response.status(400).json({
                message: "Password or email is incorrect",
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET,
        );

        return response.status(200).json({
            token,
        });
    };
}

export { UserController };
