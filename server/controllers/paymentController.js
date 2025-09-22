const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout session for invoice payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCheckoutSession = async (req, res) => {
  try {
    const { invoiceId, amount } = req.body;

    // Validate required fields
    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: 'Invoice ID is required'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Invoice #${invoiceId}`,
              description: 'Payment for invoice',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/invoices/${invoiceId}?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/invoices/${invoiceId}?payment=cancelled`,
      metadata: {
        invoiceId: invoiceId.toString(),
      },
      // Optional: Add customer information if available
      // customer_email: req.user?.email,
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      message: 'Checkout session created successfully'
    });

  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        success: false,
        message: 'Card error: ' + error.message
      });
    } else if (error.type === 'StripeRateLimitError') {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: ' + error.message
      });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({
        success: false,
        message: 'Payment service error. Please try again later.'
      });
    } else if (error.type === 'StripeConnectionError') {
      return res.status(500).json({
        success: false,
        message: 'Payment service connection error. Please try again later.'
      });
    } else if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({
        success: false,
        message: 'Payment service authentication error.'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating payment session'
    });
  }
};

/**
 * Handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      
      // Here you would typically:
      // 1. Update the invoice status in your database
      // 2. Send confirmation email to client
      // 3. Update project status if needed
      
      // Example: Update invoice status
      // await updateInvoiceStatus(session.metadata.invoiceId, 'paid');
      
      break;
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log('Payment failed for payment intent:', paymentIntent.id);
      
      // Handle failed payment
      // await updateInvoiceStatus(paymentIntent.metadata.invoiceId, 'failed');
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  handleWebhook
};
