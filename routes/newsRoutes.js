const express = require("express");
const { createNewsArticle, getNewsArticle } = require("../controllers/newsController");
const router = express.Router();


router.get("/" ,(req,res)=>{
    res.send("Hello World");
});

router.post("/create",createNewsArticle);
router.get("/get/:slug",getNewsArticle);

module.exports=router;