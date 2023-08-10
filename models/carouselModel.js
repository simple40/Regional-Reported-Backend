const mongoose = require('mongoose');

const CarouselSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

const Carousel = mongoose.model('Carousel', CarouselSchema);

module.exports = Carousel;