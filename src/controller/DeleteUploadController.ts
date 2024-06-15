import { type Request, type Response } from "express";

import { UserRepository } from "../repositories/UserRepository";
import { DeleteUploadUseCase } from "../useCases/DeleteUploadUseCase";

const userRepository = new UserRepository();
const deleteUploadUseCase = new DeleteUploadUseCase(userRepository);

class DeleteUploadController {
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

            await deleteUploadUseCase.execute({ token, fileName });

            return response.send();
        } catch (err) {
            console.log(err);

            return response.status(400).json({
                message: err,
            });
        }
    }
}

export { DeleteUploadController };
