# Vercel Deployment Guide

This guide will help you deploy the Lightweight CRM for Freelancers to Vercel.

## Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. A PostgreSQL database (recommended: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
3. A Stripe account for payments (optional)

## Step 1: Prepare Your Database

1. Create a PostgreSQL database on your preferred provider
2. Get your database connection string (it should look like: `postgresql://username:password@host:port/database_name`)
3. Run the schema from `server/database/schema.sql` on your database

## Step 2: Deploy to Vercel

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your Git repository

2. **Configure environment variables in Vercel:**
   Go to your project settings → Environment Variables and add:

   ```
   NODE_ENV=production
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   DATABASE_URL=postgresql://username:password@host:port/database_name
   FRONTEND_URL=https://your-app-name.vercel.app
   BCRYPT_ROUNDS=12
   ```

   **Optional (for Stripe payments):**
   ```
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
   ```

3. **Deploy:**
   - Vercel will automatically detect the configuration from `vercel.json`
   - Click "Deploy" and wait for the build to complete

## Step 3: Verify Deployment

1. Visit your deployed URL
2. Test user registration and login
3. Verify all features work correctly

## Important Security Notes

- **Change the JWT_SECRET** to a strong, random string in production
- **Use HTTPS** for your database connection
- **Never commit** `.env` files to version control
- **Use environment variables** for all sensitive configuration

## Troubleshooting

### Build Errors
- Check that all dependencies are properly installed
- Verify the build command in `vercel.json`
- Check the build logs in Vercel dashboard

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure your database allows connections from Vercel's IP ranges
- Check that the database schema is properly set up

### Authentication Issues
- Verify `JWT_SECRET` is set and consistent
- Check that the frontend URL matches your Vercel deployment URL

## File Structure for Deployment

```
├── api/
│   └── index.js              # Vercel API entry point
├── client/                   # React frontend
│   ├── build/               # Production build (auto-generated)
│   ├── src/                 # Source code
│   └── package.json
├── server/                  # Backend API
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── config/              # Configuration
│   └── database/            # Database schema
├── vercel.json              # Vercel configuration
├── .vercelignore            # Files to ignore during deployment
└── package.json             # Root package.json
```

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set
3. Test the API endpoints directly
4. Check the browser console for frontend errors
