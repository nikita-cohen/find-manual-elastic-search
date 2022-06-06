const express = require('express');
const searchController = require("../controller/SearchController")
const router = express.Router();

router.get('/search/:name', searchController.getLimitedSearchResultController)
router.get('/search/all/:name', searchController.getAllSearchResultController)
router.post('/search/insert', searchController.insertManualController)
router.delete('/search/delete', searchController.deleteManualController)

module.exports = router;
