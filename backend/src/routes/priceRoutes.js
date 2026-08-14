const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');
const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/:productId', optionalAuth, priceController.getProductPriceHistory);
router.post('/alerts', authenticate, priceController.createPriceAlert);
router.get('/alerts/user', authenticate, priceController.getUserPriceAlerts);
router.delete('/alerts/:id', authenticate, priceController.deletePriceAlert);

module.exports = router;
