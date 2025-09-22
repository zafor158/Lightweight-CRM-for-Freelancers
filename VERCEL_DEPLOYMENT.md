# Vercel Deployment Guide

This guide will help you deploy the Lightweight CRM for Freelancers to Vercel.

## Prerequisites

1. A Vercel account (free tier available)
2. A PostgreSQL database (recommended: Neon, Supabase, or Railway)
3. A Stripe account for payment processing

## Deployment Steps

### 1. Prepare Your Repository

The project is already configured for Vercel deployment with:
- `vercel.json` configuration file
- Proper build scripts in `package.json`
- Environment variables template

### 2. Set Up Environment Variables

In your Vercel dashboard, add the following environment variables:

#### Required Variables:
```
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret_here
DATABASE_URL=your_postgresql_connection_string
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=https://your-app-name.vercel.app
```

#### Optional Variables:
```
PORT=5000
VERCEL_URL=your-app-name.vercel.app
```

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Option B: Deploy via GitHub Integration
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on every push to main branch

### 4. Configure Stripe Webhooks

1. Go to your Stripe Dashboard
2. Navigate to Webhooks
3. Add endpoint: `https://your-app-name.vercel.app/api/payments/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the webhook secret and add it to your Vercel environment variables

### 5. Database Setup

#### Using Neon (Recommended)
1. Create a Neon account
2. Create a new database
3. Copy the connection string
4. Add it to your Vercel environment variables as `DATABASE_URL`

#### Using Supabase
1. Create a Supabase project
2. Go to Settings > Database
3. Copy the connection string
4. Add it to your Vercel environment variables as `DATABASE_URL`

### 6. Domain Configuration (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to Settings > Domains
3. Add your custom domain
4. Update `FRONTEND_URL` environment variable

## Project Structure for Vercel

```
├── vercel.json          # Vercel configuration
├── package.json         # Root package.json with build scripts
├── client/              # React frontend
│   ├── package.json     # Client dependencies and scripts
│   └── build/           # Built React app (generated)
├── server/              # Node.js backend
│   ├── index.js         # Main server file
│   └── package.json     # Server dependencies
└── env.example          # Environment variables template
```

## Build Process

Vercel will automatically:
1. Install dependencies for both client and server
2. Build the React frontend using `npm run build`
3. Deploy the server as serverless functions
4. Serve static files from the client build directory

## API Routes

All API routes are prefixed with `/api/` and will be handled by the server:
- `/api/auth/*` - Authentication routes
- `/api/clients/*` - Client management
- `/api/projects/*` - Project management
- `/api/invoices/*` - Invoice management
- `/api/payments/*` - Payment processing

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are properly installed
2. **Database Connection**: Verify your `DATABASE_URL` is correct
3. **CORS Issues**: Ensure `FRONTEND_URL` matches your deployed domain
4. **Stripe Webhooks**: Verify webhook endpoint and secret

### Logs and Debugging:

1. Check Vercel function logs in the dashboard
2. Use `vercel logs` command for real-time logs
3. Test API endpoints using the Vercel preview URL

## Security Considerations

1. Use strong, unique JWT secrets
2. Keep Stripe keys secure and use live keys only in production
3. Enable CORS properly for your production domain
4. Use environment variables for all sensitive data

## Performance Optimization

1. Enable Vercel's Edge Functions for better performance
2. Use Vercel's CDN for static assets
3. Optimize images and assets
4. Consider using Vercel's Analytics for monitoring

## Support

For issues specific to this deployment:
1. Check the Vercel documentation
2. Review the project's README.md
3. Check the server logs in Vercel dashboard
