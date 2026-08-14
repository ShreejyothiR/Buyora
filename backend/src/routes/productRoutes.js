const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, productController.getProducts);
router.get('/:id', optionalAuth, productController.getProductById);
router.post('/', productController.createProduct);
router.post('/upgrade-compare', productController.compareUpgrade);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
