import { Router } from "express";

import { UploadFiles } from "./controller";
import { upload } from "./multer";

const route = Router();
const uploadFiles = new UploadFiles();

route.post("/", upload.single("foto"), async (request, response) => {
    await uploadFiles.handle(request, response);
});

export { route };
