import {Response, CookieOptions} from "express"
import {calculateExpirationDate} from "./dateTime";
import { getEnv } from "./getEnv";


export const REFRESH_PATH = `${getEnv('HOST')}:${getEnv('HOST_PORT')}/${getEnv('API')}/user/refresh`;

const defaultCookie: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax',
    domain: getEnv("COOKIE_DOMAIN","localhost").split(',')[0], // Use the first domain from the list
}

export const getRefreshTokenCookieOptions = (): CookieOptions => {
    const expiresIn = getEnv('COOKIE_EXPIRES_IN')
    const expires = calculateExpirationDate(expiresIn)
    return {
        ...defaultCookie,
        expires,
        path: REFRESH_PATH
    }
}

export const getAccessTokenCookieOptions = (): CookieOptions => {
    const expiresIn = getEnv('COOKIE_EXPIRES_IN', '1d')
    const expires = calculateExpirationDate(expiresIn)
    return {
        ...defaultCookie,
        expires,
        path: "/"
    }
}

export const setAuthenticationCookies = (
    res: Response,
    accessToken: String,
    refreshToken: String,
): Response => res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())

export const clearAuthenticationCookies = (res: Response): Response => {
    return res.clearCookie("accessToken", {
        ...defaultCookie, 
        expires: new Date(0),
        path: '/'
    })
    .clearCookie("refreshToken", {
        ...defaultCookie,
        expires: new Date(0),
        path: REFRESH_PATH
    })
}