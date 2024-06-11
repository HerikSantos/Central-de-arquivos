import { Router } from "express";

import { ReadUploadController } from "./controller/ReadUploadController";
import {
    UploadFiles,
    IEditedRequest,
} from "./controller/UploadFilesController";
import { UserController } from "./controller/UserController";
import { authenticateMiddleware } from "./middleware/authenticateMiddleware";
import { upload } from "./multer";

const route = Router();
const uploadFiles = new UploadFiles();
const userController = new UserController();
const readUpdateController = new ReadUploadController();

route.post(
    "/upload",
    authenticateMiddleware,
    upload.single("foto"),
    async (request, response) => {
        await uploadFiles.handle(request, response);
    },
);

route.get("/upload", authenticateMiddleware, async (request, response) => {
    await readUpdateController.handle(request, response);
});

route.post("/user", async (request, response) => {
    await userController.create(request, response);
});

route.get("/user", async (request, response) => {
    await userController.read(request, response);
});

route.post("/user/login", async (request, response) => {
    await userController.login(request, response);
});

export { route };
