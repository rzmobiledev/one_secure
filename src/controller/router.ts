require('dotenv').config();
import express, {Request} from 'express';
import {userController} from './user.modules';


const router = express.Router();
router.post('/users', userController.createUser);

export default router;