const mongoose = require("mongoose");

const newsSchema= mongoose.Schema({
    title: {
        type: String,
        required : true
    },
    content: {
        type: String,
        required : true
    },
    slug: {
        type: String,
        required : true
    }
});

const News = mongoose.model("News",newsSchema);
module.exports=News;