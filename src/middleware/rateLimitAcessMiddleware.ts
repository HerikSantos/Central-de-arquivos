import { type NextFunction, type Request, type Response } from "express";

import { client } from "..";

async function rateLimitAcessMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<Response | undefined> {
    const ip =
        request.headers["x-forwarded-for"] ??
        request.socket.remoteAddress ??
        null;

    if (!ip)
        return response.status(400).json({
            message: "Where is your ip???",
        });

    const { path, methods }: { path: string; methods: object } = request.route;

    const [method] = Object.keys(methods);

    const key = `${ip.toString()}-${path}-${method}`;

    const requestCount = Number((await client.get(key)) ?? 0) + 1;

    await client.set(key, requestCount, { EX: 30 });

    if (requestCount > 5) {
        return response.status(429).json({
            message: "rate-limit",
        });
    }

    await client.set("tico", "gosotos");

    next();
}

export { rateLimitAcessMiddleware };
