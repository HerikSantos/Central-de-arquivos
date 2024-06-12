import { type User } from "../database/entities/User";
import { type IUserRepository } from "../repositories/IUserRepository";

class ReadUserUseCase {
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async execute(): Promise<User[]> {
        const result = await this.repository.read();

        return result;
    }
}

export { ReadUserUseCase };
