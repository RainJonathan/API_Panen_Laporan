const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Define route for fetching data by month
router.get('/:kebun/:month/:year', dataController.getDataByMonth);

module.exports = router;
