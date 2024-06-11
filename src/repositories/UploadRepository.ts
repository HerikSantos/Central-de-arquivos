import { type Repository } from "typeorm";

import { AppDataSource } from "../database";
import { Upload } from "../database/entities/Upload";
import { type User } from "../database/entities/User";
import { type IUploadRepository } from "./IUploadRepository";

interface IResponse {
    user_id: string;
    user_name: string;
    user_email: string;
    user_availableUploadSpace: number;
    files: string;
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
        const files = await this.repository
            .createQueryBuilder("upload")
            .innerJoin("upload.user", "user")
            .select([
                "user.id",
                "user.email",
                "user.name",
                "user.availableUploadSpace",
            ])
            .addSelect("GROUP_CONCAT(upload.file SEPARATOR ', ')", "files")
            .groupBy(
                "user.id, user.email, user.name, user.availableUploadSpace",
            )
            .getRawMany();

        console.log(files);

        return files;
    }
}

export { UploadRepository };
