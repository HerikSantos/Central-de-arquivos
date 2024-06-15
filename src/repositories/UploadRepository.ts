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
        size,
    }: {
        user: User;
        fileName: string;
        size: number;
    }): Promise<Upload> {
        const fileUpload = new Upload();
        fileUpload.file = fileName;
        fileUpload.user = user;
        fileUpload.size = size;

        const result = await this.repository.save(fileUpload);

        return result;
    }

    async read(user: User): Promise<IResponse[]> {
        const { id: userId } = user;

        const files = await AppDataSource.getRepository(User)
            .createQueryBuilder("user")
            .select([
                "user.id as id, user.email as email, user.name as name, user.availableUploadSpace as availableUploadSpace, GROUP_CONCAT(upload.file SEPARATOR ', ') AS files",
            ])
            .leftJoin("user.uploads", "upload")
            .where("user.id = :userId", { userId })
            .groupBy("user.id")
            .getRawMany<IResponse>();

        return files;
    }

    async findFileByName(
        fileName: string,
        userId: User,
    ): Promise<Upload | undefined> {
        const { id } = userId;

        const upload = await this.repository
            .createQueryBuilder("upload")
            .select(["upload.id, upload.file, upload.size, upload.userId"])
            .where("userId = :id", { id })
            .andWhere("file = :fileName", { fileName })
            .getRawOne<Upload>();

        return upload;
    }

    async delete(fileName: string, userId: User): Promise<void> {
        const { id } = userId;

        await this.repository
            .createQueryBuilder("upload")
            .delete()
            .where("user = :id", { id })
            .andWhere("file = :fileName", { fileName })
            .execute();
    }
}

export { UploadRepository };
