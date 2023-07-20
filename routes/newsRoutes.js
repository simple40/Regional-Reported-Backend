const express = require("express");
const { createNewsArticle, getNewsArticle, uploadImage, modifyNewsArticle, getAllNewsArticle, deleteNewsArticle, getNewsArticlesByCategory, getTrendingNewsArticles, getNewsArticles, search } = require("../controllers/newsController");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify the destination folder for storing uploaded files



router.get("/" ,(req,res)=>{
    res.send("Hello World");
});

router.post("/create",upload.single('image'),createNewsArticle);
router.get("/get/:slug",getNewsArticle);
router.post("/upload",upload.single('image'),uploadImage);
router.post("/modify/:id", upload.single('image'), modifyNewsArticle);
router.delete("/delete/:slug", deleteNewsArticle);
router.get("/get-All", getAllNewsArticle);
router.get("/get-News-By-Category/:category",getNewsArticlesByCategory);
router.get("/get-Trending-News",getTrendingNewsArticles);
router.get("/getNews",getNewsArticles);
router.get("/search",search);

module.exports=router;