const mongoose = require("mongoose");

const newsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    // imageData: {
    //     data: {
    //         type: Buffer, // Binary image data
    //         required: true
    //     },
    //     contentType: {
    //         type: String, // MIME type of the image
    //         required: true
    //     }
    // },
    imageUrl :{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0 // Initial value for views is set to 0
    },
    isHeadline: {
        type: Boolean,
        default: false, // By default, the news article is not a headline
      },
    ytVideoId:{
        type: String,
    },
},
    {
        timestamps: true, // Enable timestamps for automatic createdAt and updatedAt fields
    }
);

newsSchema.index({ title: 'text', content: 'text' });


const News = mongoose.model("News", newsSchema);
module.exports = News;