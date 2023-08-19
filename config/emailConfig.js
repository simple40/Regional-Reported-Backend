
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail', // Your email provider
    auth: {
      user: process.env.Gmail, // Your email address
      pass: process.env.password,   // Your email password
    },
  });

  module.exports = transporter;
  