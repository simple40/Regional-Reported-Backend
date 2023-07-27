const express = require("express");
const router = express.Router();
const {loginAdmin} = require("../controllers/authController");

router.get("/",(req,res)=>{
    res.status(200).json("auth routes");
})

router.post("/login",loginAdmin);

module.exports = router;