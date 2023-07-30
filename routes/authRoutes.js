const express = require("express");
const router = express.Router();
const {loginAdmin, validateUser} = require("../controllers/authController");
const validateToken = require("../middlewares/validateTokenHandler");

router.get("/",(req,res)=>{
    res.status(200).json("auth routes");
})

router.post("/login",loginAdmin);
router.get("/validate-user",validateToken,validateUser);

module.exports = router;