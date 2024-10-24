import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
 dotenv.config()

const accessSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string

export const generateAccessToken = async(payload : object) => {
  return jwt.sign(payload, accessSecretKey, {expiresIn: '1h'})
}

export const verifyToken = async(token : string) => {
  return jwt.verify(token, accessSecretKey)
}