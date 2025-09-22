# Lightweight CRM for Freelancers

A simple Customer Relationship Management (CRM) tool tailored specifically for freelancers. It allows them to manage clients, track project statuses, and generate invoices with integrated Stripe payment processing.

## Features

- **Client Management**: Add, edit, and organize client information
- **Project Tracking**: Manage multiple projects per client with status tracking
- **Invoice Generation**: Create and send invoices with "Pay Now" functionality
- **Stripe Integration**: Secure payment processing for one-time payments
- **Dashboard**: Overview of clients, projects, and revenue
- **Authentication**: Secure JWT-based authentication system

## Tech Stack

### Backend
- **Node.js/Express**: Server framework
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Stripe**: Payment processing
- **bcryptjs**: Password hashing

### Frontend
- **React**: UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Hook Form**: Form handling
- **React Hot Toast**: Notifications
- **Lucide React**: Icons
- **date-fns**: Date utilities

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Stripe account (for payment processing)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lightweight-crm-freelancers
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up the database**
   ```bash
   # Create a PostgreSQL database
   createdb crm_freelancers
   
   # Run the schema
   psql crm_freelancers < server/database/schema.sql
   ```

4. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit server/.env with your configuration:
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   DATABASE_URL=postgresql://username:password@localhost:5432/crm_freelancers
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## Usage

### Getting Started

1. **Register an account** at `http://localhost:3000/register`
2. **Login** to access the dashboard
3. **Add your first client** from the Clients page
4. **Create a project** for your client
5. **Generate an invoice** for the project
6. **Test payment processing** using Stripe's test mode

### Key Features

#### Client Management
- Add client contact information
- Track project count and active projects
- View detailed client profiles

#### Project Tracking
- Create projects with descriptions and due dates
- Track project status (In Progress, Completed, Overdue, On Hold)
- Set hourly rates and track total hours
- Automatic amount calculation

#### Invoice Management
- Generate unique invoice numbers
- Set due dates and descriptions
- Track invoice status (Draft, Sent, Paid, Overdue)
- Integrated Stripe payment processing

#### Dashboard
- Overview of total clients, projects, and revenue
- Recent activity feed
- Quick action buttons

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PATCH /api/projects/:id/status` - Update project status

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PATCH /api/invoices/:id/status` - Update invoice status

### Payments
- `POST /api/payments/create-checkout-session` - Create Stripe checkout session
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/status/:invoiceId` - Get payment status

## Stripe Integration

The application integrates with Stripe for payment processing:

1. **Test Mode**: Use Stripe test keys for development
2. **Checkout Sessions**: Create secure payment sessions
3. **Webhooks**: Handle payment confirmations
4. **Payment Status**: Track payment status for invoices

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Add the keys to your `.env` file
4. Set up webhook endpoints in Stripe dashboard pointing to `/api/payments/webhook`

## Database Schema

The application uses the following main tables:

- **users**: User accounts and authentication
- **clients**: Client information and contact details
- **projects**: Project details linked to clients
- **invoices**: Invoice information linked to projects

## Development

### Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── database/          # Database schema
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
└── package.json           # Root package.json
```

### Key Learnings

This project demonstrates:

- **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality for multiple related resources
- **Complex State Management**: Managing application state in React with contexts and hooks
- **Third-party Integration**: Integrating Stripe payment gateway for secure payments
- **Secure Backend**: Creating secure API endpoints without exposing secret keys
- **Dynamic UI Generation**: Creating dynamic views and components based on data
- **Authentication**: JWT-based authentication system
- **Database Relationships**: Managing related data across multiple tables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
