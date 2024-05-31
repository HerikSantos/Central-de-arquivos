import express from "express";

import { route } from "./routes";

const app = express();

app.use(express.json());
app.use("/upload", route);

app.listen(3333, () => {
    console.log("rodando na porta 3333");
});
