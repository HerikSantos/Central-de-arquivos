import jwt from "jsonwebtoken";

interface IJwtPayload {
    id: string;
    email: string;
    exp: number;
}

function getInfoFromJWToken(token: string): null | IJwtPayload {
    return jwt.decode(token) as null | IJwtPayload;
}

export { getInfoFromJWToken };
