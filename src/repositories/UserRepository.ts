import { type Repository } from "typeorm";

import { AppDataSource } from "../database";
import { User } from "../database/entities/User";
import { type IUserRepository } from "./IUserRepository";

interface IUser {
    name: string;
    email: string;
    password: string;
}

class UserRepository implements IUserRepository {
    repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async read(): Promise<User[]> {
        return await this.repository.find();
    }

    async create({ name, email, password }: IUser): Promise<User> {
        const userCreated = this.repository.create({ name, email, password });

        return await this.repository.save(userCreated);
    }

    async findByID({ id }: { id: string }): Promise<User | null> {
        return await this.repository.findOneBy({ id });
    }

    async findByEmail({ email }: { email: string }): Promise<User | null> {
        return await this.repository.findOneBy({
            email,
        });
    }

    async edit({
        id,
        availableUploadSpace,
    }: {
        id: string;
        availableUploadSpace: number;
    }): Promise<void> {
        const user = await this.findByID({ id });

        if (!user) {
            throw new Error("User not found");
        }

        Object.assign(user, { availableUploadSpace });

        await this.repository.save(user);
    }

    async updateAvailableSpace(user: User, space: number): Promise<void> {
        user.availableUploadSpace = user.availableUploadSpace + space;
        await this.repository.save(user);
    }
}

export { UserRepository };
