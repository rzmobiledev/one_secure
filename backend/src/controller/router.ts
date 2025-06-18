require('dotenv').config();
import express from 'express';
import {userController} from './user.modules';
import { authenticateJWT } from '../passport/jwt.strategy';


const router = express.Router();
router.post('/users', userController.createUser);
router.post('/users/login', userController.login);
router.get('/users/:id', authenticateJWT, userController.getProfile);
router.get('/user/refresh', userController.refreshToken);
router.post('/users/logout', authenticateJWT, userController.logout);
router.post('/users/domaincheck', authenticateJWT, userController.domainCheck);
router.post("/users/refresh", userController.refreshToken)

export default router;