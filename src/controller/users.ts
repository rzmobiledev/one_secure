import { PrismaClient, Prisma  } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import {Request, Response} from 'express'
import * as utils from '../extra/utils'

const prisma = new PrismaClient()
  .$extends(withAccelerate())
  
export class UserController {

  public createUser = async(req: Request, res: Response){
        const { username, email, password } = req.body
        const hashed_password = await utils.encryptUserPassword(password);
        try{
            await prisma.user.create({
                data: {
                  username: username,
                  email: email,
                  password: hashed_password
                },
              });
              return res.status(201).json({username: username, email: email});
        }catch(e){
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (e.code === 'P2002') {
                  console.log(
                    'There is a unique constraint violation, a new user cannot be created with this email'
                  )
                  return res.status(400).json({error: 'User with this email already exist'});
                }
              }
              res.status(400).json({error: e});
              process.exit(1)
        }
      }

  public getProfile = async(req: Request, res: Response){
    const { username, email } = req.body

    try{
      await prisma.user.findFirst({
        where: {
          username: username,
          email: email
        }
      })
      return res.status(200).json({username: username, email: email});
    }catch(e){
      res.status(400).json({error: e});
      process.exit(1)
    }
  }

}