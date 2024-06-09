import { type Request, type Response } from "express";

import { UserRepository } from "../repositories/UserRepository";
import { UploadFileUseCase } from "../useCases/UploadFileUseCase";

const userRepository = new UserRepository();
const uploadFileUseCase = new UploadFileUseCase(userRepository);

interface IEditedRequest extends Request {
    token: string;
}

class UploadFiles {
    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { file } = request;

            if (!file)
                return response.status(400).json({
                    message: "File is required",
                });

            const { authorization } = request.headers;

            if (!authorization) {
                return response.status(401).json({
                    message: "Token is required",
                });
            }

            const [, token] = authorization.split(" ");

            if (!token) return response.send("Token is required");

            const result = await uploadFileUseCase.execute(file, token);

            return response.json({
                spaceLimiteRemaining: result.availableUploadSpace,
                linkDownload: result.signedUrl,
            });
        } catch (err) {
            console.log(err);

            return response.status(400).json(err.message);
        }
    }
}

export { UploadFiles, type IEditedRequest };
