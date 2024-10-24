import { Schema, model } from "mongoose";
import IBlog from "../Interface/blogInterface";

const BlogSchema = new Schema<IBlog>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String },
  content: { type: String },
  image: { type: String },
  createdAt : {type:Date, default : Date.now}
})

const Blog = model<IBlog>('Blog', BlogSchema)

export default Blog