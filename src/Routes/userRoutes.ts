import { Router } from "express";
import authenticationMiddleware from "../Middlewares/authenticationMiddleware";
import upload from "../Middlewares/uploadMiddleware";

const UserController = require('../Controllers/userController')

const router = Router()

router.get('/', authenticationMiddleware, UserController.getUser)
router.patch('/', authenticationMiddleware, upload.single('file'), UserController.updateUser)
router.post('/signup', UserController.postSignup)
router.post('/login', UserController.postLogin)

export default router