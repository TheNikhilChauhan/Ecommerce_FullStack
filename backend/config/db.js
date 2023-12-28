import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Successfully connected to mongoDB `);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
