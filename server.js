const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");

const port = process.env.PORT || 5000;
connectDb();
const app = express();
app.use(express.json());

app.use("/news",require("./routes/newsRoutes"));

app.get("/",(req,res)=>
{
    res.send("hello");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
