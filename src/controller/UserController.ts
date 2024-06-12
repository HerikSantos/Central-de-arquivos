import { type Request, type Response } from "express";

import { type User } from "../database/entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { CreateUserUseCase } from "../useCases/CreateUserUseCase";
import { LoginUserUseCase } from "../useCases/LoginUserUseCase";
import { ReadUserUseCase } from "../useCases/ReadUserUseCase";

const userRepository = new UserRepository();
const readUserUseCase = new ReadUserUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

class UserController {
    read = async (request: Request, response: Response): Promise<Response> => {
        try {
            const users = await readUserUseCase.execute();

            return response.status(200).json({
                users,
            });
        } catch (err) {
            console.log(err);
            return response.status(500).json({
                message: err,
            });
        }
    };

    create = async (
        request: Request,
        response: Response,
    ): Promise<Response> => {
        try {
            const { name, email, password }: User = request.body;
            const user = await createUserUseCase.execute({
                name,
                email,
                password,
            });

            return response.status(201).json({ user });
        } catch (err) {
            console.log(err);

            return response.status(400).json({
                message: err.message,
            });
        }
    };

    login = async (request: Request, response: Response): Promise<Response> => {
        try {
            const { email, password }: User = request.body;

            const token = await loginUserUseCase.execute({ email, password });

            return response.status(200).json({
                token,
            });
        } catch (err) {
            console.log(err);

            return response.status(400).json({
                message: err.message,
            });
        }
    };
}

export { UserController };
