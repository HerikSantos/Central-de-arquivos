import { type User } from "../database/entities/User";

interface IUser {
    name: string;
    email: string;
    password: string;
}

class IUserRepository {
    read: () => Promise<User[]>;
    findByID: ({ id }: User) => Promise<User | null>;
    create: ({ name, email, password }: IUser) => Promise<User>;
    findByEmail: ({ email }: { email: string }) => Promise<User | null>;
}

export { IUserRepository };
