const express = require('express');
const router = express.Router();
const compareController = require('../controllers/compareController');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, compareController.compareProducts);

module.exports = router;
