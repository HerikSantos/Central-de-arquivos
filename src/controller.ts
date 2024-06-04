import { type Request, type Response } from "express";

import { uploadFiles } from "./awsConfig";

class UploadFiles {
    async handle(request: Request, response: Response): Promise<Response> {
        const file = request.file;

        if (!file)
            return response.status(400).json({
                message: "File is required",
            });

        console.log(file);

        await uploadFiles(file.originalname, file);

        return response.send("oi bb ");
    }
}

export { UploadFiles };
