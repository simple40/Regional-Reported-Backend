const YoutubeData = require('../models/youtubeData.');
const asyncHandler = require('express-async-handler');
//const path = require('path');
//require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const youtube = require('../config/ytApiConnection');


// const { google } = require("googleapis");
// const api_key = process.env.API_KEY;
// console.log(api_key);
// const connectDb = require("../config/dbConnection");
// connectDb();
// const mongoose = require('mongoose');

// const YoutubeDataSchema = mongoose.Schema({
//     title: {
//         type : String,
//         required : true
//     },
//     videoId: {
//         type : String,
//         required : true
//     }
// });
// const YoutubeData = mongoose.model("Youtube Data",YoutubeDataSchema);

// const youtube = google.youtube({
//     version: "v3",
//     auth: "AIzaSyDGDoWZDELQsbQhsVv59gyVqTZT7M1Jk_I",
//   });

const fetchAndStoreYoutubeData = asyncHandler(async()=>{
    const channelId = "UCeH4vLgigCddC0ObtQ4nmyQ"; // Replace with your actual channel ID
    const maxResults = 10; // Number of videos to fetch
    
    const params = {
        part : "snippet",
        channelId : channelId,
        order : 'viewCount',
        maxResults: maxResults
    }
    try {
        const { data } = await youtube.search.list(params);
        const videos = data.items;
        
        const videosList = videos.map((video) => ({
            videoId: video.id.videoId,
            title: video.snippet.title
        }));
        
        await YoutubeData.deleteMany({});
        await YoutubeData.insertMany(videosList);
        console.log("Videos updated successfully");
    } catch (error) {
        console.error("Error fetching and storing YouTube data:",error);
    }
})

module.exports = fetchAndStoreYoutubeData;