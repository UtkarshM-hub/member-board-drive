import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const monngodb_url = process.env.MONGO_URI;
const connectMongoDB = async () => {
    await mongoose.connect(monngodb_url).then(() => {
        console.log("mongodb is connected");
    }).catch((error) => {
        console.log("mongodb not connected");
        console.log(error);
    });
}

export default connectMongoDB;
// module.exports = connectMongoDB