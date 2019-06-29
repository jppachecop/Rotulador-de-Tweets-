const express = require('express');
const router = express.Router();

// Require the controllers
const homeController = require('../controllers/home.controller');

router.post('/signup', homeController.create);

module.exports = router;
