const { google } = require("googleapis");
const api_key = process.env.API_KEY;

const youtube = google.youtube({
    version: "v3",
    auth: api_key,
  });

  module.exports = youtube;


