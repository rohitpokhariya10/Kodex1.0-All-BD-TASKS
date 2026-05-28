require("dotenv").config();

const app = require("./src/app");
const connectToDb = require("./src/config/db");

connectToDb();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
