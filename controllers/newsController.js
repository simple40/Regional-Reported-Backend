const asyncHandler = require("express-async-handler");
const News = require("../models/newsModel");
const slugify = require("slugify");

const createNewsArticle = asyncHandler(async (req,res)=>{
    console.log(req.body);
    const{title, content} = req.body;
    if(!title , !content){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const slug = slugify(title, { lower: true, strict: true });
    
    const newsArticle = await News.create({
        title,
        content,
        slug,
    });
    if(newsArticle){
        res.status(201).json({newsArticle});
    }
    else{
        res.status(400);
        throw new Error("data not valid");
    }

});

const getNewsArticle = asyncHandler(async(req, res)=>{
    const slug = req.params.slug;
    const newsArticle = await News.find({slug: slug});
    res.status(201).json(newsArticle);
});


module.exports = {createNewsArticle, getNewsArticle};