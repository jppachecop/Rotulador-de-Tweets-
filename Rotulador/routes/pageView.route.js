const express = require('express');
const router = express.Router();

// Require the controllers
const pageViewController = require('../controllers/pageView.controller');

router.get('/', pageViewController.pageLogin);
router.get('/signup', pageViewController.pageSignUp);
router.get('/filter', pageViewController.pageFilter);

module.exports = router;