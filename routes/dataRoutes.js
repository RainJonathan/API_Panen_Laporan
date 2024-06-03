const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Define route for fetching data by month
router.get('/:month', dataController.getDataByMonth);

module.exports = router;
