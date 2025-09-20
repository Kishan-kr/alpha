const express = require('express');
const router = express.Router();


const subscribeController = require('../controllers/Newsletter/subscribe');
const unsubscribeController = require('../controllers/Newsletter/unsubscribe');

// Subscribe to newsletter
router.post('/subscribe', subscribeController);

// Unsubscribe from newsletter
router.post('/unsubscribe', unsubscribeController);

module.exports = router;
