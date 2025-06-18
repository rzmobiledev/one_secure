import {UserController} from './userController'
import { AuthService } from './auth.service'
import { UserService } from './user.service'

const authService = new AuthService()
const userController = new UserController(authService)
const userService = new UserService()

export {userController, userService}