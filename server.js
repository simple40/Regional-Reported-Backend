const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");
const fetchAndStoreYoutubeData = require('./Scripts/fetchAndStoreYoutubeData');
const cron = require('node-cron');
const debug = require("debug");

const port = process.env.PORT || 5000;
connectDb();
const app = express();
const corsOptions = {
    origin: 'http://localhost:3000', // Replace this with your actual frontend URL
    credentials: true,
  };
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.static('D:/Node/MyImages'));
//fetchAndStoreYoutubeData();


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

  cron.schedule("0 * * * *", () => {
    debug("cron");
    fetchAndStoreYoutubeData();
  });

  // Keep the event loop active
setInterval(() => {
  // A dummy task to keep the event loop active
  console.log("Event loop is active");
  fetchAndStoreYoutubeData();
}, 1000 * 60 * 60 * 10 ); // Run every 5 minutes
