const mongoose = require('mongoose');

const headlineSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

const Headline = mongoose.model('Headline', headlineSchema);

module.exports = Headline;