require("dotenv").config();

const app = require("./src/app");
const connectToDb = require("./src/config/db");

// Connect to MongoDB before accepting API requests.
connectToDb();

const port = process.env.PORT || 8000;

// Start the Express server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
