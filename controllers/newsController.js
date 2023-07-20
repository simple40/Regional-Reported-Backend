const asyncHandler = require("express-async-handler");
const News = require("../models/newsModel");
const slugify = require("slugify");
const fs = require('fs');
const sharp = require('sharp');
const { constants } = require("../constants");

const createNewsArticle = asyncHandler(async (req, res) => {
  console.log(req.body);
  const imageFile = req.file;
  const newsData = req.body;
  const { title, content, category } = newsData;
  if (!title, !content, !category, !imageFile) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const slug = slugify(title, { lower: true, strict: true });
  const imageData = fs.readFileSync(imageFile.path);
  const bufferImageData = Buffer.from(imageData);


  const newsArticle = await News.create({
    title,
    content,
    slug,
    imageData: {
      data: bufferImageData,
      contentType: 'image/jpeg'
    },
    category
  });

  fs.unlink(imageFile.path, (err) => {
    if (err) {
      console.error('Error deleting image file:', err);
    }
  });

  if (newsArticle) {
    res.status(201).json({ newsArticle });
  }
  else {
    res.status(400);
    throw new Error("data not valid");
  }

});

const getNewsArticle = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const newsArticle = await News.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  );
  const imageData = newsArticle.imageData.data;
  const base64String = imageData.toString('base64');

  res.status(200).json({ news: newsArticle, base64String: base64String });
});

const uploadImage = asyncHandler(async (req, res) => {
  const file = req.file;
  const data = req.body;
  const { title, content } = data;
  const fileName = file.originalname;
  const imageData = fs.readFileSync(file.path);
  const bufferImageData = Buffer.from(imageData);
  const uint8Array = new Uint8Array(imageData); // Create Uint8Array from the array of integers
  const bufferData = Buffer.from(uint8Array);

  //     sharp(bufferImageData)
  //   .toFile('uploads/image.jpg', (error, info) => {
  //     if (error) {
  //       console.error('Error converting image:', error);
  //     } else {
  //       console.log('Image converted successfully');
  //     }
  //   });
  //const processedImageBase64 = await sharp(bufferData).resize(300, 200).toFormat('jpeg').toBase64();
  const base64String = imageData.toString('base64');

  fs.unlink(file.path, (err) => {
    if (err) {
      console.error('Error deleting image file:', err);
    }
  });
  res.status(201).json({ base64String });
})

const modifyNewsArticle = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const { title, content, category } = req.body;
  const imageFile = req.file;
  const modifiedData = {};

  if (title) {
    modifiedData.title = title;
    modifiedData.slug = slugify(title, { lower: true, strict: true });
  }
  if (content) {
    modifiedData.content = content;
  }
  if (category) {
    modifiedData.category = category;
  }
  if (imageFile) {
    const bufferedImageData = fs.readFileSync(imageFile.path);
    modifiedData.imageData = {
      data: bufferedImageData,
      contentType: 'image/jpeg'
    }

    fs.unlink(imageFile.path, (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
      }
    });
  }



  const newsArticle = await News.findById(id);

  if (!newsArticle) {
    res.status(404).json({ message: "News Article not found!" });
    return;
  }

  // newsArticle.title = title;
  // newsArticle.content = content;
  // await newsArticle.save();

  const modifiedNewsArticle = await News.findByIdAndUpdate(
    id,
    modifiedData,
    { new: true }
  );

  res.status(200).json({ message: 'News article modified successfully', news: modifiedNewsArticle });

});

const deleteNewsArticle = asyncHandler(async (req, res) => {

  const { slug } = req.params;
  const deletedNewsArticle = await News.findOneAndDelete({ slug });
  if (!deletedNewsArticle) {
    return res.status(404).json({ message: 'News article not found' });
  }
  res.status(200).json({ message: 'News article deleted successfully' });
})

const getAllNewsArticle = asyncHandler(async (req, res) => {

  const newsArticles = await News.find({});
  if (!newsArticles) {
    res.status(400);
    throw new Error("Something went wrong");
  }
  res.status(200).json(newsArticles);

});

const getNewsArticlesByCategory = asyncHandler(async (req, res) => {

  const { category } = req.params;
  const newsArticles = await News.find({ category });
  if (!newsArticles) {
    res.status(404);
    throw new Error("Something went wrong. You Entered wrong category");
  }
  res.status(200).json(newsArticles);

});

const getTrendingNewsArticles = asyncHandler(async (req, res) => {

  const currentDate = new Date();

  // Calculate the start date of the time frame
  const startDate = new Date(currentDate.getTime() - constants.TIME_FRAME);

  // Query the database for news articles within the time frame
  const trendingNews = await News.find({
    createdAt: { $gte: startDate, $lte: currentDate }
  }).sort({ views: -1 }).limit(6); // Limiting to top 6 trending news

  if (!trendingNews) {
    trendingNews = await News.find().sort({ views: -1 }).limit(6)
  }

  trendingNews.forEach(newsArticle => {
    console.log(newsArticle.title);
  });

  // Return the trending news
  res.status(200).json(trendingNews);

});

const getNewsArticles = asyncHandler(async (req, res) => {

  const { category, sortBy = 'date', sortOrder = 'desc' } = req.query;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  let query = News.find();

  if (category) {
    query = query.where('category').equals(category);
  }
  let sortingOption = {};
  if (sortBy === 'date') {
    sortingOption.createdAt = sortOrder === 'asc' ? 1 : -1;
  }
  else if (sortBy === 'views') {
    sortingOption.views = sortOrder === 'asc' ? 1 : -1;
  }

  
  //query = query.skip(skip).limit(pageSize);
  query = query.sort(sortingOption);

  const newsArticles = await query.exec();
  if (!newsArticles) {
    res.status(404);
    throw new Error("News Articles not found!");
  }

  const paginatedNewsArticles = newsArticles.slice(skip, skip + pageSize);
  
  const totalItems = newsArticles.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  paginatedNewsArticles.forEach(newsArticle => {
    console.log(newsArticle.title);
  });

  res.status(200).json({
    page,
    pageSize,
    totalPages,
    totalItems,
    paginatedNewsArticles
  });

});

const search = asyncHandler(async (req, res) => {

  const searchQuery = req.query.q;
  const searchResults = await News.find(
    { $text: { $search: searchQuery } }
  );
  if (!searchResults) {
    res.status(404);
    throw new Error("No result found!");
  }
  searchResults.forEach(newsArticle => {
    console.log(newsArticle.title);
  });
  res.status(200).json(searchResults);

});



module.exports = { createNewsArticle, getNewsArticle, uploadImage, modifyNewsArticle, deleteNewsArticle, getAllNewsArticle, getNewsArticlesByCategory, getTrendingNewsArticles, getNewsArticles, search };