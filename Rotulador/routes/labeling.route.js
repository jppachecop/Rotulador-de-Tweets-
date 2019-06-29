const express = require('express');
const router = express.Router();

// Require the controllers
const labelingController = require('../controllers/labeling.controller');

router.get('/labeling', labelingController.showTweets);
router.post('/labeling', labelingController.labelTweets);
router.post('/filter', labelingController.filterTweets);
router.get('/end', labelingController.endOfLabel);

module.exports = router;