import { DataSource } from "typeorm";

import { env } from "../enviroment";

const AppDataSource = new DataSource({
    type: "mysql",
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: ["./src/database/entities/*.ts"],
});

export { AppDataSource };
