import AWS from "aws-sdk";
import dotenv from "dotenv";

import { type User } from "../database/entities/User";
import { type IUploadRepository } from "../repositories/IUploadRepository";

dotenv.config();

const s3 = new AWS.S3({});

class DownloadFileUseCase {
    private readonly repository: IUploadRepository;

    constructor(repository: IUploadRepository) {
        this.repository = repository;
    }

    async execute(fileName: string, user: User): Promise<string> {
        const bucketName = "projetosteste-herik";

        const file = await this.repository.findFileByName(fileName, user);

        if (!file) throw new Error("File not found");

        const generateSignedUrl = (bucketName, key, expires): string => {
            const params = {
                Bucket: bucketName,
                Key: key,
                Expires: expires,
            };

            return s3.getSignedUrl("getObject", params);
        };

        const signedUrl = generateSignedUrl(bucketName, fileName, 60);

        return signedUrl;
    }
}

export { DownloadFileUseCase };
