const express = require("express");
const router = express.Router();
const News = require("../controller/News");

router.get("/feed", News.getHeadlines);
router.get("/feed/:category", News.getNewsByCategory);
router.post("/feed/filter", News.filterResults);
router.get("/sources", News.getSources);
router.get("/search", News.getNewsBySearch);
module.exports = router;
