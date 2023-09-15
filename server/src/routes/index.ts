import express from 'express';
import {userController} from "../controllers";

const router = express.Router();

router.post('/register', userController.registerUser);

export default router;