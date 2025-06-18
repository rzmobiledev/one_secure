import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import { HTTP_STATUS} from "../config/http.config";
import {ErrorException} from "./errorException";
import { z } from "zod"
import {REFRESH_PATH, clearAuthenticationCookies} from "../utils/cookie";

const formatZodError = (res: Response, error: z.ZodError): Response => {
    const errors = error?.issues?.map(err => ({
        field: err.path.join("."),
        message: err.message
    }))

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Validation failed.",
        errors: errors
    })
}

export const errorHandler: ErrorRequestHandler = (error: any, req: Request, res: Response, next: NextFunction): any => {

    if(req.path === REFRESH_PATH) clearAuthenticationCookies(res)

    if(error instanceof SyntaxError) return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid JSON format, please check your request body"
    })

    if (error instanceof z.ZodError) return formatZodError(res, error)

    if(error instanceof ErrorException) {
        return res.status(error.status_code).json({
            message: error.message,
            errorCode: error.error_code
        })
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        errorCode: error?.message || "Unknown Error"
    })
}