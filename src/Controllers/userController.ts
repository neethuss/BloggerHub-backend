import User from "../Models/userModel";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
import { generateAccessToken } from "../utils/jwtUtils";
import { CustomRequest } from "../Middlewares/authenticationMiddleware";
import Blog from "../Models/blogModel";
import IMulterS3File from "../Interface/multerInterface";

export const postSignup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({ Message: "User already exists with this email" });
    } else {
      const hashedPassword = await hashPassword(password);
      const newUser = new User({ username:username.toLowercase().trim(), email, password: hashedPassword });
      await newUser.save();
      return res.status(201).send(newUser);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Message: "Internal Server Error" });
  }
};

export const postLogin = async (req: Request, res: Response) => {
  console.log('post login')
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({ Message: "User not found with this email" });
    }

    const isPasswordMatch = await comparePassword(password, existingUser.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ Message: "Password does not match" });
    }

    const userBlogs = await Blog.find({ user: existingUser._id }).populate('user', 'username image')
    const blogs = await Blog.find().populate('user', 'username image')
    const accessToken = await generateAccessToken({ email: existingUser.email });

    res.cookie("userRefreshToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000,
    });
    return res.status(200).send({
      existingUser,
      accessToken,
      userBlogs,
      blogs,
      Message: "Authentication verified",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Message: "Internal Server Error" });
  }

};


export const getUser = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ email: req.user })
    if (user) {
      const userBlogs = await Blog.find({ user: user._id })
      return res.status(200).send({ user, userBlogs, Message: "Succesfully fetched user details" });

    }

  } catch (error) {
    console.log(error);
    return res.status(500).send({ Message: "Internal Server Error" });
  }
}


export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    console.log('updateuser')
    const { username, email } = req.body;
    const file = req.file as unknown as IMulterS3File;
    console.log(file, 'file')
    const existingUser = await User.findOne({ email: req.user })
    if (!existingUser) {
      return res.status(404).send({ Message: 'User not found' });
    }
    console.log(existingUser, 'user ex')
    const image = file ? file.location : existingUser.image;

    const updatedUser = await User.findByIdAndUpdate(
      existingUser._id,
      { email: email, username: username, image: image },
      { new: true }
    );
    console.log(updatedUser, 'up user')
    return res.status(200).send({ updatedUser, Message: 'Blog updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Message: 'An error occurred while updating the blog.' });
  }
};
