import { Router } from "express";

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

route.post(
    "/upload",
    authenticateMiddleware,
    upload.single("foto"),
    async (request, response) => {
        await uploadFiles.handle(request, response);
    },
);

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
