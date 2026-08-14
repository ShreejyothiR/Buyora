const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalAuth } = require('../middleware/auth');

router.get('/:productId', optionalAuth, reviewController.getProductReviews);
router.post('/', optionalAuth, reviewController.addReview);

module.exports = router;
