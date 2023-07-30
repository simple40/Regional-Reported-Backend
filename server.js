const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");

const port = process.env.PORT || 5000;
connectDb();
const app = express();
const corsOptions = {
    origin: 'http://localhost:3001', // Replace this with your actual frontend URL
    credentials: true,
  };
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.static('D:/Node/MyImages'));

app.use("/news",require("./routes/newsRoutes"));
app.use("/admin",require("./routes/authRoutes"));
app.use(errorHandler);
app.get("/",(req,res)=>
{
    res.send("hello");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
