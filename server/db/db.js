import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const connectToDatabase = async () => {
    try {
        // Directly use the uri from the environment variables
        await mongoose.connect(process.env.MONGO_URI); 

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);

        // Optionally, log the full error stack for debugging
        console.error(error.stack);

        // Exit the process if the database connection fails
        process.exit(1); // Exiting if the database connection fails
    }
};

export default connectToDatabase;
