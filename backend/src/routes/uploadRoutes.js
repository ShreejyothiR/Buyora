const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, upload.single('file'), uploadController.uploadAndExtract);

module.exports = router;
