import { Router } from "express";

const BlogController = require('../Controllers/blogController')
import upload from "../Middlewares/uploadMiddleware";
import authenticationMiddleware from "../Middlewares/authenticationMiddleware";

const router = Router()

router.post('/', authenticationMiddleware,upload.single('file'), BlogController.postBlog)
router.patch('/:blogId', authenticationMiddleware, upload.single('file'), BlogController.updateBlog);
router.delete('/:blogId', authenticationMiddleware, BlogController.deleteBlog)
router.get('/blogs',authenticationMiddleware, BlogController.getBlogs)
router.get('/userblogs', authenticationMiddleware, BlogController.getUserBlogs)

export default router