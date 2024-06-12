import bcrypt from "bcryptjs";
import validator from "validator";

import { type User } from "../database/entities/User";
import { type IUserRepository } from "../repositories/IUserRepository";
class CreateUserUseCase {
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async execute({
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }): Promise<User> {
        if (!name || !email || !password) throw new Error("Invalid Data");

        if (!validator.isEmail(email)) {
            throw new Error("Invalid email");
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const result = await this.repository.create({
            name,
            email,
            password: hashPassword,
        });

        return result;
    }
}

export { CreateUserUseCase };
