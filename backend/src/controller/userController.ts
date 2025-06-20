import { PrismaClient, Prisma  } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { spawn } from 'child_process'
import { withAccelerate } from '@prisma/extension-accelerate'
import {Request, Response} from 'express'
import * as utils from '../utils/pwdEncryption'
import {registerSchema, loginSchema} from '../validators/user.validator'
import { ErrorException } from '../utils/errorException'
import { ErrorCode } from "../utils/enum";
import {HTTP_STATUS} from "../config/http.config"
import { fifteenMinutesFromNow, fortyFiveMinutesFromNow } from '../utils/dateTime'
import { refreshTokenSignOptions, signJWTToken } from '../utils/jwt'
import { AuthService } from './auth.service'
import { clearAuthenticationCookies, getAccessTokenCookieOptions, setAuthenticationCookies } from '../utils/cookie'
import { isValidDomain } from '../validators/domain.validator'

  
export class UserController {

  private prisma = new PrismaClient()
  .$extends(withAccelerate())

  private authService: AuthService; 
  constructor(authService: AuthService) {
    this.authService = authService;
}

  public createUser = async(req: Request, res: Response): Promise<any> => {
        const body = registerSchema.parse(req.body)
        const userAgent = req.headers['user-agent'];
        const hashed_password = await utils.encryptUserPassword(body.password);
        
        try{

            const user = await this.prisma.user.create({
                data: {
                  username: body.username,
                  email: body.email,
                  password: hashed_password,
                  useragent: userAgent ? userAgent.toString() : '',
                },
              });

              return res.status(201).json({id: user.id, username: user.username, email: user.email});
        }catch(e){
            if (e instanceof PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (e.code === 'P2002') {
                  return res.status(400).json({error: 'User with this email already exist'});
                }
              }
              return res.status(400).json({error: e});
        }
      }

  public getProfile = async(req: Request, res: Response): Promise<any> =>{
    try{
      const { id } = req.params
      const user = await this.prisma.user.findFirst({
        where: {
          id: Number(id)
        },
        omit: {
          password: true
        }
      });
      if(!user){
        throw new ErrorException(
            "User not found",
            ErrorCode.AUTH_USER_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
        )
      }

      return res.status(200).json(user);

    }catch(e: unknown){
      if(e instanceof ErrorException){
        return res.status(e.status_code).json({error: e.message, code: e.status_code});
      }
      return res.status(HTTP_STATUS.BAD_REQUEST).json({error: e});
    }
  }

  public login = async(req: Request, res: Response): Promise<any> => {
    
    try{
      const userAgent = req.headers['user-agent'];
      const body = loginSchema.parse({
        ...req.body,
        userAgent: userAgent
      })

      const user = await this.prisma.user.findUnique({
        where: {
          email: body.email
        }   
      });   

      if(!user){
        throw new ErrorException(
            "Invalid email or password provided",
            ErrorCode.AUTH_USER_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
        )
      }

      const isPasswordValid: boolean = await utils.comparePassword(body.password, user.password)

      if(!isPasswordValid){
          throw new ErrorException( 
              "Invalid email or password provided",
              ErrorCode.ACCESS_UNAUTHORIZED,
              HTTP_STATUS.UNAUTHORIZED
          )
      }
  
      const accessToken = signJWTToken({
          username: user.username,
          email: user.email,
          expiredAt: fifteenMinutesFromNow()
      })

      const refreshToken = signJWTToken({
        username: user.username,
        email: user.email,
        expiredAt: fortyFiveMinutesFromNow()
    }, refreshTokenSignOptions)
      
      return setAuthenticationCookies(
        res,
        accessToken,
        refreshToken,
    ).status(HTTP_STATUS.OK).json({
        message: "User login successfully",
    })
      
    }catch(e: unknown){
      if(e instanceof ErrorException){
        return res.status(e.status_code).json({error: e.message, code: e.status_code});
      }
      return res.status(HTTP_STATUS.BAD_REQUEST).json({error: e});
    }
  }

  public refreshToken = async(req: Request, res: Response): Promise<any> => {
    try{
      const refreshToken = req.cookies.refreshToken as string
      if(!refreshToken) throw new ErrorException( 
        "Missing refresh token",
        ErrorCode.AUTH_INVALID_TOKEN,
        HTTP_STATUS.BAD_REQUEST
      )

      const {accessToken, newRefreshToken} = await this.authService.refreshToken(refreshToken)
      if(newRefreshToken) res.cookie("refreshToken", newRefreshToken)

      return res.status(HTTP_STATUS.OK)
          .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
          .json({message: "Refresh access token successfully"})

    }catch(e: unknown){
      if(e instanceof ErrorException){
        return res.status(e.status_code).json({error: e.message, code: e.status_code});
      }
      return res.status(HTTP_STATUS.BAD_REQUEST).json({error: e});

    }
  }

  public logout = async (req: Request, res: Response): Promise<any> => {
    return clearAuthenticationCookies(res).status(HTTP_STATUS.OK).json({
        message: "User logout successfully",
    })
  }

  public domainCheck = async(req: Request, res: Response): Promise<any> => {
    
      try{
        const {domain} = req.body
        if (!isValidDomain(domain)){
          throw new ErrorException(
            "Invalid domain provided",
            ErrorCode.INVALID_DOMAIN,
            HTTP_STATUS.BAD_REQUEST
          );
        }

        const pythonProcess = spawn('python', ['domaincheck/main.py', '-d', String(domain)]);
        let result = '';
        
        pythonProcess.stdout.on('data', (data) => {
          result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          throw new ErrorException(
            `Python script error ${data}`,
            ErrorCode.INTERNAL_SERVER_ERROR,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
          );
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                  res.status(HTTP_STATUS.OK).json({
                    data: result
                  });
            } else {
              throw new ErrorException(
                `Python script exited with code ${code}`,
                ErrorCode.INTERNAL_SERVER_ERROR,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
              );
            }
        });
      } catch (e) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: e instanceof Error ? e.message : 'An error occurred while processing the request'
          });
    }
  };
  
}