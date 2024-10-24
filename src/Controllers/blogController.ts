import { Types } from "mongoose"
import IMulterS3File from "../Interface/multerInterface"
import Blog from "../Models/blogModel"
import { Request, Response } from "express"
import { CustomRequest } from "../Middlewares/authenticationMiddleware"
import User from "../Models/userModel"

export const postBlog = async (req: CustomRequest, res: Response) => {
  try {
    const { title, content } = req.body
    const file = req.file as unknown as IMulterS3File;
    if (!file) {
      return res.status(404).send({ Message: 'Error uploading image' })
    } else {
      const image = file.location
      const user = await User.findOne({ email: req.user })
      const newBlog = new Blog({ user: user?._id, title, content, image })
      await newBlog.save()
      return res.status(201).send({ newBlog, Message: 'Blog created' })
    }
  } catch (error) {
    console.log(error)
  }
}

export const updateBlog = async (req: CustomRequest, res: Response) => {
  try {
    const blogId = req.params.blogId;
    const { title, content } = req.body;
    const file = req.file as unknown as IMulterS3File;

    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).send({ Message: 'Blog not found' });
    }

    const image = file ? file.location : existingBlog.image;

    const user = await User.findOne({ email: req.user });
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { user: user ? user._id : existingBlog.user, title, content, image },
      { new: true }
    );

    return res.status(200).send({ updatedBlog, Message: 'Blog updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Message: 'An error occurred while updating the blog.' });
  }
};


export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.blogId

    const deleteBlog = await Blog.findByIdAndDelete(blogId)
    return res.status(201).send({ deleteBlog, Message: 'Blog deleted' })

  } catch (error) {
    console.log(error)
  }
}

export const getBlogs = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ email: req.user })
    const blogs = await Blog.find().populate('user', 'username image')
    return res.status(200).send({ user, blogs, Message: 'All blogs' })
  } catch (error) {
    console.log(error)
  }

}

export const getUserBlogs = async (req: Request, res: Response) => {
  try {
    const user = new Types.ObjectId('671119b7ad3fd9f609f991c5')

    const blogs = await Blog.findOne({ user: user }).populate('user', 'username image')
    return res.status(200).send({ blogs, Message: 'All blogs' })
  } catch (error) {
    console.log(error)
  }
}
