import { Prisma  } from '@prisma/client'
import { verifyJwtToken, AccessTPayload, signJWTToken, refreshTokenSignOptions } from '../utils/jwt'
import { ErrorException } from '../utils/errorException'
import { ErrorCode } from "../utils/enum";
import {HTTP_STATUS} from "../config/http.config"
import { fifteenMinutesFromNow, fortyFiveMinutesFromNow, ONE_DAY_IN_MS } from '../utils/dateTime';

export class AuthService {

    public refreshToken = async(refreshToken: string): Promise<Record<string, string | undefined>> => {
        const { payload } = verifyJwtToken<AccessTPayload>(refreshToken)
        
        if(!payload) throw new ErrorException(
            "Invalid refresh token",
            ErrorCode.AUTH_INVALID_TOKEN,
            HTTP_STATUS.UNAUTHORIZED
        )

        const now: number = Date.now()

        if(Number(payload.expiredAt) < now) throw new ErrorException(
            "Session expired",
            ErrorCode.AUTH_INVALID_TOKEN,
            HTTP_STATUS.UNAUTHORIZED
        )

        const sessionRequiresRefresh: boolean = (Number(payload.expiredAt) - now) < ONE_DAY_IN_MS
  

        const newRefreshToken = sessionRequiresRefresh ? signJWTToken({
            username: payload.username, 
            email: payload.email,
            expiredAt: fortyFiveMinutesFromNow()
        }, refreshTokenSignOptions) : undefined

        const accessToken = signJWTToken({
            username: payload.username, 
            email: payload.email,
            expiredAt: fifteenMinutesFromNow()
        })

        return {
            accessToken,
            newRefreshToken
        }
    }

}