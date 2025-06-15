import jwt, { SignOptions, VerifyOptions} from "jsonwebtoken";
import { getEnv } from "./getEnv";

export type AccessTPayload = {
    username: string
    email: string,
    expiredAt: Date
}

type SignOptsAndSecret = SignOptions & {
    secret: string
}

const defaultJWT: SignOptions =  {
    audience: ["user"]
}

export const AccessTokenSignOptions: SignOptsAndSecret = {
    expiresIn: Number(getEnv('JWT_EXPIRE_IN')),
    secret: getEnv('JWT_SECRET_KEY')
}

export const refreshTokenSignOptions: SignOptsAndSecret = {
    expiresIn: Number(getEnv('JWT_REFRESH_EXPIRE_IN')),
    secret: getEnv('JWT_SECRET_REFRESH')
}

export const signJWTToken = (
    payload: AccessTPayload,
    options?: SignOptsAndSecret
): string => {
    const { secret, ...opts } = options || AccessTokenSignOptions
    return jwt.sign(payload, secret, {
        ...defaultJWT,
        ...opts
    })
}

export const verifyJwtToken = <T extends object = AccessTPayload>(
    token: string,
    options?: VerifyOptions & { secret: string }
) => {
    try{
        const {secret = getEnv('JWT_SECRET_KEY'), ...opts} = options || refreshTokenSignOptions
        const payload = jwt.verify(token, secret, {
            ...defaultJWT,
            ...opts
        }) as T
        return { payload }
    }catch(error: any){
        console.error("JWT verification error:", error)
        return { error: error.message }
    }
}