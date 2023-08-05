const mongoose = require('mongoose');

const YoutubeDataSchema = mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    videoId: {
        type : String,
        required : true
    }
});
const YoutubeData = mongoose.model("Youtube Data",YoutubeDataSchema);
module.exports = YoutubeData;