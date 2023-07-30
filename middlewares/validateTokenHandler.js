const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const cookie = require("cookie"); 

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  // let authHeader = req.headers.Authorization || req.headers.authorization;
  // if (authHeader && authHeader.startsWith("Bearer")) {
  //   token = authHeader.split(" ")[1];
  //   jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
  //     if (err) {
  //       res.status(401);
  //       throw new Error("User is not authorized");
  //     }
  //     req.user = decoded.user;
  //     next();
  //   });

  //   if (!token) {
  //     res.status(401);
  //     throw new Error("User is not authorized or token is missing");
  //   }
  // }
  // else{
  //   res.status(401);
  //   throw new Error("User is not logged in");
  // }

  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    // Parse the cookie header to get the cookies as key-value pairs
    const cookies = cookie.parse(cookieHeader);
    // Get the JWT token from the HttpOnly cookie (Assuming the cookie name is 'jwtToken')
    token = cookies.jwtToken;
  }
  //console.log(token);
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user;
      next();
    });
  } else {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
});

module.exports = validateToken;