import { ErrorCode } from "./enum";

export class ErrorException extends Error{
    private statusCode: number
    private errorCode: string

    constructor(
        message: string,
        errorCode: ErrorCode,
        statusCode: number,
    ) {
        super(message);
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
    }

    public get status_code(){
        return this.statusCode;
    }

    public get error_code() {
        return this.errorCode
    }
}

