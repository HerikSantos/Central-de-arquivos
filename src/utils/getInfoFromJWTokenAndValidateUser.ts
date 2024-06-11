import jwt from "jsonwebtoken";

import { type User } from "../database/entities/User";
import { UserRepository } from "../repositories/UserRepository";

interface IJwtPayload {
    id: string;
    email: string;
    exp: number;
}

const userRepository = new UserRepository();

async function getInfoFromJWTokenAndValidateUser(token: string): Promise<User> {
    const userInfo = jwt.decode(token) as null | IJwtPayload;

    if (!userInfo) throw new Error("Token is not valid");

    const { id } = userInfo;

    const user = await userRepository.findByID({ id });

    if (!user) throw new Error("Token is not valid");

    return user;
}

export { getInfoFromJWTokenAndValidateUser };
