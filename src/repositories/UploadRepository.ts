import { type Repository } from "typeorm";

import { AppDataSource } from "../database";
import { Upload } from "../database/entities/Upload";
import { User } from "../database/entities/User";
import { type IUploadRepository } from "./IUploadRepository";

interface IResponse {
    id: string;
    name: string;
    email: string;
    availableUploadSpace: number;
    file: string;
}

class UploadRepository implements IUploadRepository {
    private readonly repository: Repository<Upload>;

    constructor() {
        this.repository = AppDataSource.getRepository(Upload);
    }

    async create({
        user,
        fileName,
    }: {
        user: User;
        fileName: string;
    }): Promise<Upload> {
        const fileUpload = new Upload();
        fileUpload.file = fileName;
        fileUpload.user = user;

        const result = await this.repository.save(fileUpload);

        return result;
    }

    async read(user: User): Promise<IResponse[]> {
        const { id: userId } = user;

        const files = await AppDataSource.getRepository(User)
            .createQueryBuilder("user")
            .select([
                "user.id as id, user.email as email, user.name as name, user.availableUploadSpace as availableUploadSpace, upload.file",
            ])
            .leftJoin("user.uploads", "upload")
            .where("user.id = :userId", { userId })
            .getRawMany<IResponse>();

        return files;
    }
}

export { UploadRepository };
