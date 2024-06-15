import AWS from "aws-sdk";
import dotenv from "dotenv";

import { type IUserRepository } from "../repositories/IUserRepository";
import { UploadRepository } from "../repositories/UploadRepository";
import { getInfoFromJWTokenAndValidateUser } from "../utils/getInfoFromJWTokenAndValidateUser";

dotenv.config();

class DeleteUploadUseCase {
    private readonly userRepository: IUserRepository;
    private readonly uploadRepository = new UploadRepository();

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute({
        token,
        fileName,
    }: {
        token: string;
        fileName: string;
    }): Promise<void> {
        const s3 = new AWS.S3();

        const infoUser = await getInfoFromJWTokenAndValidateUser(token);

        const bucketName = "projetosteste-herik";

        const params = {
            Bucket: bucketName,
            Key: fileName,
        };

        const infoUpload = await this.uploadRepository.findFileByName(
            fileName,
            infoUser,
        );

        if (!infoUpload) throw new Error("File not found");

        const { size } = infoUpload;

        await s3.deleteObject(params).promise();

        await this.uploadRepository.delete(fileName, infoUser);

        await this.userRepository.edit({
            id: infoUser.id,
            availableUploadSpace: infoUser.availableUploadSpace + size,
        });
    }
}

export { DeleteUploadUseCase };
