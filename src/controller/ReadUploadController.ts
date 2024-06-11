import { type Response, type Request } from "express";

import { UploadRepository } from "../repositories/UploadRepository";
import { ReadUploadUseCase } from "../useCases/ReadUploadUseCase";

const uploadRepository = new UploadRepository();
const readUploadUseCase = new ReadUploadUseCase(uploadRepository);

class ReadUploadController {
    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { authorization } = request.headers;

            if (!authorization) {
                return response.status(401).json({
                    message: "Token is required",
                });
            }

            const [, token] = authorization.split(" ");

            const result = await readUploadUseCase.execute(token);

            return response.status(200).json(result);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }
}

export { ReadUploadController };
