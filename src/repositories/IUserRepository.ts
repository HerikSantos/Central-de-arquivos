import { type User } from "../database/entities/User";

interface IUser {
    name: string;
    email: string;
    password: string;
}

class IUserRepository {
    read: () => Promise<User[]>;
    findByID: ({ id }: { id: string }) => Promise<User | null>;
    create: ({ name, email, password }: IUser) => Promise<User>;
    findByEmail: ({ email }: { email: string }) => Promise<User | null>;
    edit: ({
        id,
        availableUploadSpace,
    }: {
        id: string;
        availableUploadSpace?: number;
    }) => Promise<void>;
}

export { IUserRepository };
