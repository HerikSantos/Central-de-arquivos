import { type Request, type Response } from "express";

class UploadFiles {
    handle(request: Request, response: Response): Response {
        console.log(request);

        return response.send("oi bb ");
    }
}

export { UploadFiles };
