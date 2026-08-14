const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/auth');

router.post('/extract', optionalAuth, aiController.extractFromInput);
router.post('/chat', optionalAuth, aiController.chat);
router.post('/recommend', optionalAuth, aiController.recommendByBudget);

module.exports = router;
