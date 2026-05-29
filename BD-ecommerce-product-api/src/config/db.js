const mongoose = require("mongoose");

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