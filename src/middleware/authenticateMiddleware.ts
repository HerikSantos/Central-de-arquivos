import { type Response, type Request, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import validator from "validator";

import { env } from "../enviroment";
import { UserRepository } from "../repositories/UserRepository";

interface IAuthorization {
    id: string;
    email: string;
}

const userRepository = new UserRepository();

async function authenticateMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<Response | undefined> {
    try {
        const { authorization } = request.headers;

        if (!authorization) {
            return response.status(401).json({
                message: "Token is required",
            });
        }

        const [, token] = authorization.split(" ");

        if (!validator.isJWT(token)) {
            return response.status(400).json({
                message: "Invalid token",
            });
        }
        const { id } = jwt.verify(token, env.JWT_SECRET) as IAuthorization;

        const userExist = await userRepository.findByID({ id });

        if (!userExist) {
            return response.status(400).json({
                message: "Invalid token",
            });
        }

        next();
    } catch (error) {
        console.log(error);

        return response.status(400).json({
            message: "Invalid token",
        });
    }
}

export { authenticateMiddleware };
