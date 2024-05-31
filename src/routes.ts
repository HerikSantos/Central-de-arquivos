import { Router } from "express";

import { UploadFiles } from "./controller";
import { upload } from "./multer";

const route = Router();
const uploadFiles = new UploadFiles();

route.post("/", upload.single("foto"), (request, response) => {
    uploadFiles.handle(request, response);
});

export { route };
