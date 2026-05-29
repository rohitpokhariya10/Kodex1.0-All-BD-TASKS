const mongoose = require("mongoose");

// Opens a single MongoDB connection using the application environment config.
const connectToDb = async (req , res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDb")
    }
    catch(error){
        console.log("error--->" , error)
        console.error("Error in MongoDb connection" , error)
    }
}

module.exports = connectToDb;
