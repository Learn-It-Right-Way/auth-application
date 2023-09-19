import express from 'express';
import {userController} from "../controllers";
import { UserValidation } from '../middlewares';

const router = express.Router();

router.get('/confirm/:token', userController.confirm);
router.get('/check-auth', userController.checkAuth);

router.post('/register', UserValidation.validateRegistration, userController.registerUser);
router.post('/login', UserValidation.validateLogin, userController.login);

export default router;