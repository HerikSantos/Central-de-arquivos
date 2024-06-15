import { type Upload } from "../database/entities/Upload";
import { type User } from "../database/entities/User";

interface IResponse {
    id: string;
    name: string;
    email: string;
    availableUploadSpace: number;
    file: string;
}

class IUploadRepository {
    create: ({
        user,
        fileName,
    }: {
        user: User;
        fileName: string;
    }) => Promise<Upload>;

    read: (user: User) => Promise<IResponse[]>;

    delete: (fileName: string, userId: User) => Promise<void>;

    findFileByName: (
        fileName: string,
        userId: User,
    ) => Promise<Upload | undefined>;
}

export { IUploadRepository };
