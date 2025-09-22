const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Create Stripe Checkout session (protected route)
router.post('/create-checkout-session', authenticateToken, createCheckoutSession);

// Stripe webhook endpoint (no auth required - uses webhook signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;