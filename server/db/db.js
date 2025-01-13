import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const connectToDatabase = async () => {
    try {
        const uri = process.env.MONGO_URI; // Extract the connection string from environment variables

        if (!uri) {
            throw new Error("MONGODB_URL is not defined in the environment variables.");
        }

        await mongoose.connect(uri, {
            useUnifiedTopology: true,  // Uses the latest MongoDB connection engine
        });

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);

        // Optionally, log the full error stack for debugging
        console.error(error.stack);

        // Exit the process if the database connection fails
        process.exit(1);
    }
};

export default connectToDatabase;
