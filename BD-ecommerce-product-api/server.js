require("dotenv").config();
const app = require("./src/app");
const connectToDb = require("./src/config/db");


// Establish the database connection before accepting incoming API traffic.
connectToDb();

// Starts the HTTP server for the Express application.
let port = 3000 || 8000;
app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
});

