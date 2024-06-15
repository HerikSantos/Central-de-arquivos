import { type IUploadRepository } from "../repositories/IUploadRepository";
import { getInfoFromJWTokenAndValidateUser } from "../utils/getInfoFromJWTokenAndValidateUser";

interface IResponse {
    id: string;
    name: string;
    email: string;
    availableUploadSpace: number;
    file: string;
}

class ReadUploadUseCase {
    private readonly repository: IUploadRepository;

    constructor(repository: IUploadRepository) {
        this.repository = repository;
    }

    async execute(token: string): Promise<IResponse> {
        const user = await getInfoFromJWTokenAndValidateUser(token);

        const [infoUser] = await this.repository.read(user);

        infoUser.availableUploadSpace = Math.floor(
            infoUser.availableUploadSpace / 1000000,
        );

        return infoUser;
    }
}

export { ReadUploadUseCase };
