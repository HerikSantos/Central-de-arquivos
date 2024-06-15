import { type Request, type Response } from "express";

import { UploadRepository } from "../repositories/UploadRepository";
import { DownloadFileUseCase } from "../useCases/DownloadFileUseCase";
import { getInfoFromJWTokenAndValidateUser } from "../utils/getInfoFromJWTokenAndValidateUser";

const uploadRepository = new UploadRepository();
const downloadFileUseCase = new DownloadFileUseCase(uploadRepository);

class DownloadFileController {
    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { fileName } = request.params;

            const { authorization } = request.headers;

            if (!authorization) {
                return response.status(401).json({
                    message: "Token is required",
                });
            }

            const [, token] = authorization.split(" ");

            const user = await getInfoFromJWTokenAndValidateUser(token);

            const signedurl = await downloadFileUseCase.execute(fileName, user);

            return response.json({
                linkDownload: signedurl,
            });
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }
}

export { DownloadFileController };
