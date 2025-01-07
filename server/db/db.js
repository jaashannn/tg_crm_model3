import mongoose from "mongoose";
import dotenv from 'dotenv';  // Use import syntax
dotenv.config();  // Load environment variables from .env file

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected")
    } catch(error) {
        console.log(error)
    }
}

export default connectToDatabase