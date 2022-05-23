const express = require('express');
const searchController = require("../controller/SearchController")
const router = express.Router();


router.get('/search/:name', searchController.getLimitedSearchResultController)
router.get('/search/all/:name', searchController.getAllSearchResultController)

module.exports = router;
