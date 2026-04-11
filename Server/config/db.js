import mongoose from "mongoose";

async function ConnectDb() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!");
    }catch(err){
        console.log(err);
    }
    
}

export default ConnectDb;