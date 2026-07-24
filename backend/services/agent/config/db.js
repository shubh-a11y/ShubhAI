import mongoose from "mongoose"


const connectDb = async () =>
{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected")
    }
    catch(err)
    {
        console.log(`Error connecting to database: ${err}`)
    }

} 

export default connectDb;