import { type IUploadRepository } from "../repositories/IUploadRepository";
import { getInfoFromJWTokenAndValidateUser } from "../utils/getInfoFromJWTokenAndValidateUser";

interface IResponse {
    id: string;
    name: string;
    email: string;
    availableUploadSpace: number;
    files: string;
}

class ReadUploadUseCase {
    private readonly repository: IUploadRepository;

    constructor(repository: IUploadRepository) {
        this.repository = repository;
    }

    async execute(token: string): Promise<IResponse> {
        const user = await getInfoFromJWTokenAndValidateUser(token);

        const [infoUser] = await this.repository.read(user);

        const formetedInfoUser = {
            id: infoUser.user_id,
            name: infoUser.user_name,
            email: infoUser.user_email,
            availableUploadSpace: infoUser.user_availableUploadSpace,
            files: infoUser.files,
        };

        return formetedInfoUser;
    }
}

export { ReadUploadUseCase };
