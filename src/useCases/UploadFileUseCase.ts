import { uploadFiles } from "../awsConfig";
import { type IUserRepository } from "../repositories/IUserRepository";
import { UploadRepository } from "../repositories/UploadRepository";
import { getInfoFromJWTokenAndValidateUser } from "../utils/getInfoFromJWTokenAndValidateUser";

interface IResponse {
    availableUploadSpace: string;
    signedUrl: string;
}

const uploadRepository = new UploadRepository();

class UploadFileUseCase {
    private readonly repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async execute(
        file: Express.Multer.File,
        token: string,
    ): Promise<IResponse> {
        const { size, originalname } = file;

        const jwtPayLoad = await getInfoFromJWTokenAndValidateUser(token);
        if (!jwtPayLoad) throw new Error("Invalid Token");

        const { id } = jwtPayLoad;

        const user = await this.repository.findByID({ id });
        if (!user) throw new Error("Invalid Token");

        const { availableUploadSpace } = user;

        if (availableUploadSpace + size >= 200000000) {
            throw new Error(
                `Insufficient space limit, ${Math.floor(200 - availableUploadSpace / 1000000)}MB disponible`,
            );
        }

        await this.repository.edit({
            id,
            availableUploadSpace: availableUploadSpace + size,
        });

        const newUser = await this.repository.findByID({ id });

        const infoFiles = await uploadFiles(originalname, file);

        if (!infoFiles) throw new Error("Someting wrong");

        const { result: signedUrl, bucketName, key } = infoFiles;

        if (!newUser)
            throw new Error(
                `Insufficient space limit, ${Math.floor(200 - availableUploadSpace / 1000000)}MB disponible`,
            );

        await uploadRepository.create({
            user: newUser,
            fileName: `${bucketName}/${key}`,
        });

        // eslint-disable-next-line
        const result = {
            availableUploadSpace: `${Math.floor(200 - newUser.availableUploadSpace / 1000000)}MB disponible`,
            signedUrl,
        } as IResponse;

        return result;
    }
}

export { UploadFileUseCase };
