import dotenv from "dotenv";
import { string, z } from "zod";

dotenv.config();

const envSchema = z.object({
    AWS_ACCESS_KEY_ID: string(),
    AWS_SECRET_ACCESS_KEY: string(),
    AWS_REGION: string(),
    DB_USERNAME: string(),
    DB_HOST: string(),
    DB_PASSWORD: string(),
    DB_DATABASE: string(),
    DB_PORT: string(),
});

const env = envSchema.parse(process.env);

export { env };
