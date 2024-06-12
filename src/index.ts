import express from "express";
import { createClient } from "redis";

import { AppDataSource } from "./database";
import { rateLimitAcessMiddleware } from "./middleware/rateLimitAcessMiddleware";
import { route } from "./routes";

const app = express();

app.use(express.json());
app.use(route);

const client = createClient().on("Error", (err) => {
    console.log("Redis Client Error", err);
});

AppDataSource.initialize()
    .then(async () => {
        await client.connect();
        app.listen(3333, () => {
            console.log("rodando na porta 3333");
        });
    })
    .catch((err) => {
        console.log("Error ao iniciar a conexão com banco de dados" + err);
    });

export { client };
