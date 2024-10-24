import mongoose from "mongoose";

const connectDB = async()=>{
 try {
  const connect = await mongoose.connect(`${process.env.MONGODB_URI}`,{
    dbName : 'BW1'
  })
  console.log('Database is connected')
 } catch (error) {
  console.log(error)
  process.exit(1)
 }
}

export default connectDB