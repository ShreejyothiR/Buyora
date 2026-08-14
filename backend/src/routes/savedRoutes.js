const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, savedController.getSavedProducts);
router.post('/toggle', authenticate, savedController.toggleSaveProduct);

module.exports = router;
