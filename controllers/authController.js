const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");


const loginAdmin = asyncHandler(async (req,res) =>{
    console.log("login by admin");
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400);
      console.log("All fields are mandatory!")
      throw new Error("All fields are mandatory!");
    }
    const admin = await Admin.findOne({ username });
    //compare password with hashedpassword
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const accessToken = jwt.sign(
        {
          admin: {
            username: admin.username
          },
        },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "15m" }
      );
      console.log("jwt sent");
      res.status(200).json({ accessToken });
    } else {
      res.status(401);
      throw new Error("email or password is not valid");
    }
  });

  module.exports = {loginAdmin};