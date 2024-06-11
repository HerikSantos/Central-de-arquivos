import { type Upload } from "../database/entities/Upload";
import { type User } from "../database/entities/User";

interface IResponse {
    user_id: string;
    user_name: string;
    user_email: string;
    user_availableUploadSpace: number;
    files: string;
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
}

export { IUploadRepository };
