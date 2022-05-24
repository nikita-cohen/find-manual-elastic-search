const searchService = require('../service/SearchService')

const getAllSearchResultController = async (req, res) => {
    const word = req.params.name;
    try {
        const collections = await searchService.getAllManuals(word);
        res.json(collections);
    } catch (e) {
        res.json(e);
    }
}

const getLimitedSearchResultController = async (req, res) => {
    const word = req.params.name;
    try {
        const data = await searchService.getManuals(word);
        res.json(data)
    } catch (e) {
        res.json(e);
    }
}

const insertManualController = async (req, res) => {
    const manual = req.body;
    try {
        const data = await searchService.insertManual(manual);
        res.json(data);
    } catch (e) {
        res.json(e);
    }
}

module.exports = {getAllSearchResultController, getLimitedSearchResultController, insertManualController};
