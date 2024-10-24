import { Document, Types } from "mongoose";

interface IBlog extends Document{
  user : Types.ObjectId
  title : string;
  content : string;
  image : string;
  createdAt :Date
}

export default IBlog