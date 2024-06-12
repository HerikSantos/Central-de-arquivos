import { Router } from "express";

import { ReadUploadController } from "./controller/ReadUploadController";
import { UploadFiles } from "./controller/UploadFilesController";
import { UserController } from "./controller/UserController";
import { authenticateMiddleware } from "./middleware/authenticateMiddleware";
import { rateLimitAcessMiddleware } from "./middleware/rateLimitAcessMiddleware";
import { upload } from "./multer";

const route = Router();
const uploadFiles = new UploadFiles();
const userController = new UserController();
const readUpdateController = new ReadUploadController();

route.post(
    "/upload",
    rateLimitAcessMiddleware,
    authenticateMiddleware,
    upload.single("foto"),
    async (request, response) => {
        await uploadFiles.handle(request, response);
    },
);

route.get(
    "/upload",
    rateLimitAcessMiddleware,
    authenticateMiddleware,
    async (request, response) => {
        await readUpdateController.handle(request, response);
    },
);

route.post("/user", rateLimitAcessMiddleware, async (request, response) => {
    await userController.create(request, response);
});

route.get("/user", rateLimitAcessMiddleware, async (request, response) => {
    await userController.read(request, response);
});

route.post(
    "/user/login",
    rateLimitAcessMiddleware,
    async (request, response) => {
        await userController.login(request, response);
    },
);

export { route };
