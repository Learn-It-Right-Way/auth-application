import express from 'express';
import {userController} from "../controllers";
import { UserValidation } from '../middlewares';

const router = express.Router();

router.post('/register', UserValidation.validateRegistration ,userController.registerUser);
router.get('/confirm/:token', userController.confirm);

export default router;