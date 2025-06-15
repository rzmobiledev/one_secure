import {
    ExtractJwt,
    StrategyOptionsWithoutRequest,
    Strategy,
    VerifiedCallback,
} from "passport-jwt";
import {PassportStatic} from "passport";
import {Request} from "express"
import {ErrorCode} from "../utils/enum";
import {UserService} from "../controller/user.service";
import passport from "passport";
import { ErrorException } from "../utils/errorException";
import { HTTP_STATUS } from "../config/http.config";
import { getEnv } from "../utils/getEnv";


interface JwtPayload {
    username: string
    email: string
}

interface RequestWithEmail extends Request {
    username: string,
    email: string
}

const options: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        <T extends Request>(req: T): string => {
            const accessToken = req.cookies.accessToken
            if(!accessToken) throw new ErrorException(
                "Unauthorized access token",
                ErrorCode.AUTH_TOKEN_NOT_FOUND,
                HTTP_STATUS.UNAUTHORIZED
            )
            return accessToken
        }
    ]),
    secretOrKey: getEnv('JWT_SECRET_KEY'),
    audience: ["user"],
    algorithms: ["HS256"],
    passReqToCallback: <any>true,
}

const setupJwtStrategy = (passport: PassportStatic) => {

    // @ts-ignore
    passport.use(new Strategy(options, async<T extends RequestWithEmail>(req: T, payload: JwtPayload, done: VerifiedCallback): Promise<void> => {
        try{
            const userService = new UserService()
            const user = await userService.getUserById(payload.email)
            if(!user) {
                return done(null,  false)
            }
            req.email = payload.email
            return done(null, user, payload)
        }catch(err){
            return done(err, false)
        }
    }))
}


setupJwtStrategy(passport)
export const authenticateJWT = passport.authenticate(
    'jwt', {session: false}
)