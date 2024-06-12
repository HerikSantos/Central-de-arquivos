import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

import { env } from "../enviroment";
import { type IUserRepository } from "../repositories/IUserRepository";

class LoginUserUseCase {
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async execute({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<string> {
        if (!email || !password) {
            throw new Error("Password or email is incorrect");
        }
        if (!validator.isEmail(email)) {
            throw new Error("Invalid email");
        }

        const user = await this.repository.findByEmail({ email });

        if (!user) {
            throw new Error("Password or email is incorrect");
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            throw new Error("Password or email is incorrect");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET,
        );

        return token;
    }
}

export { LoginUserUseCase };
