import express from "express";

import { AppDataSource } from "./database";
import { route } from "./routes";

const app = express();

app.use(express.json());
app.use(route);

AppDataSource.initialize()
    .then(() => {
        app.listen(3333, () => {
            console.log("rodando na porta 3333");
        });
    })
    .catch((err) => {
        console.log("Error ao iniciar a conexão com banco de dados" + err);
    });
