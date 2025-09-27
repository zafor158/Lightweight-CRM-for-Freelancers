# 🚀 FreelancePro: Lightweight CRM for Freelancers
<img width="1901" height="900" alt="image" src="https://github.com/user-attachments/assets/d2e4753e-c86e-4f93-bdc8-f66ab0320a8c" />

<div align="center">

<div align="center">

### 🌟 **Stunning Cosmic Login Experience**

*Experience the future of freelancing with our interstellar-themed interface*

**Key Visual Features:**
- ✨ Animated star fields and floating celestial bodies
- 🌌 Dynamic nebula effects with cosmic gradients  
- 🚀 Glassmorphism design with glowing borders
- 📱 Fully responsive across all devices

</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-purple.svg)](https://stripe.com/)

</div>

## ✨ Overview

FreelancePro is a cutting-edge Customer Relationship Management (CRM) platform designed specifically for freelancers. It combines powerful functionality with a stunning, cosmic-themed user interface that makes managing clients, projects, and invoices feel like embarking on an interstellar journey.

### 🌟 Key Highlights

- **🎨 Stunning Cosmic UI**: Rich animated backgrounds with floating celestial bodies, meteor streaks, and nebula effects
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **🔐 Enterprise Security**: JWT-based authentication with bcrypt password hashing
- **💳 Stripe Integration**: Secure payment processing with real-time status updates
- **📊 Advanced Analytics**: Comprehensive insights with interactive charts and visualizations
- **🎯 Smart Navigation**: Context-aware back buttons and dynamic breadcrumbs

## 🚀 Features

### 🎨 **Visual Excellence**
- **Cosmic Backgrounds**: Animated star fields, floating planets, and meteor streaks
- **Glassmorphism Design**: Modern frosted glass effects with vibrant color schemes
- **Smooth Animations**: Entrance effects, hover states, and micro-interactions
- **Responsive Layout**: Adaptive design that works perfectly on all devices

### 👥 **Client Management**
- Add, edit, and organize client information with rich contact details
- Track project count and active projects per client
- View detailed client profiles with project history
- Smart search and filtering capabilities

### 📋 **Project Tracking**
- Create projects with detailed descriptions and due dates
- Track project status (In Progress, Completed, Overdue, On Hold)
- Set hourly rates and track total hours automatically
- Priority levels and project categorization

### 💰 **Invoice Management**
- Generate unique invoice numbers automatically
- Set due dates, descriptions, and payment terms
- Track invoice status (Draft, Sent, Paid, Overdue)
- Integrated Stripe payment processing with "Pay Now" functionality

### 📊 **Analytics Dashboard**
- Revenue trajectory with interactive charts
- Project status distribution with pie charts
- Performance metrics and time tracking
- Client growth and payment success rates

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI framework with hooks
- **React Router** - Client-side routing with navigation context
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Performant form handling
- **React Hot Toast** - Elegant notifications

### **Backend**
- **Node.js/Express** - Server framework with middleware
- **PostgreSQL** - Relational database with connection pooling
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing and verification
- **Stripe** - Payment processing integration
- **Helmet** - Security headers
- **Rate Limiting** - API protection

### **Design System**
- **Cosmic Color Palette** - Unified color scheme across all components
- **Glassmorphism Effects** - Modern frosted glass aesthetics
- **Responsive Grid** - Mobile-first design approach
- **Animation Framework** - Smooth transitions and micro-interactions

## 📸 Key Features Showcase

<div align="center">

### 🏠 **Dashboard Experience**
- **Rich Analytics**: Interactive charts and performance metrics
- **Quick Actions**: Streamlined navigation and task management
- **Real-time Updates**: Live data synchronization
- **Cosmic Theme**: Stunning animated backgrounds

### 👥 **Client Management**
- **Comprehensive Profiles**: Detailed client information and history
- **Smart Search**: Advanced filtering and search capabilities
- **Project Tracking**: Visual project status and progress
- **Responsive Design**: Optimized for all screen sizes

### 📊 **Analytics & Reporting**
- **Revenue Tracking**: Interactive charts and trend analysis
- **Performance Metrics**: Key performance indicators
- **Visual Insights**: Beautiful data visualizations
- **Export Capabilities**: Generate reports and exports

### 💰 **Invoice Management**
- **Professional Invoices**: Clean, branded invoice templates
- **Payment Processing**: Integrated Stripe payment gateway
- **Status Tracking**: Real-time payment status updates
- **Automated Workflows**: Streamlined billing processes

</div>

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Stripe account (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zafor158/Lightweight-CRM-for-Freelancers.git
   cd Lightweight-CRM-for-Freelancers
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

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎯 Usage Guide

### Getting Started
1. **Register an account** at the stunning login page
2. **Login** to access your cosmic dashboard
3. **Add your first client** from the Clients page
4. **Create a project** for your client
5. **Generate an invoice** with integrated payment processing
6. **Track analytics** with beautiful visualizations

### Key Workflows

#### Client Management
- Navigate to Clients page
- Click "Add New Client" button
- Fill in contact information and details
- View client profile with project history

#### Project Tracking
- Select a client and create a new project
- Set project details, due date, and hourly rate
- Track progress and update status
- Monitor project analytics

#### Invoice Generation
- Create invoice from project details
- Set payment terms and due date
- Generate unique invoice number
- Send to client with "Pay Now" functionality

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Client Management
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Project Management
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PATCH /api/projects/:id/status` - Update project status

### Invoice Management
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PATCH /api/invoices/:id/status` - Update invoice status

### Payment Processing
- `POST /api/payments/create-checkout-session` - Create Stripe checkout session
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/status/:invoiceId` - Get payment status

## 💳 Stripe Integration

The application features seamless Stripe integration for secure payment processing:

### Features
- **Test Mode**: Use Stripe test keys for development
- **Checkout Sessions**: Create secure payment sessions
- **Webhooks**: Handle payment confirmations automatically
- **Payment Status**: Real-time payment status tracking

### Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Add the keys to your `.env` file
4. Set up webhook endpoints pointing to `/api/payments/webhook`

## 🗄️ Database Schema

The application uses a well-structured PostgreSQL database with the following main tables:

- **users**: User accounts and authentication
- **clients**: Client information and contact details
- **projects**: Project details linked to clients
- **invoices**: Invoice information linked to projects

### Key Features
- Foreign key constraints for data integrity
- Automatic timestamp updates
- Indexed columns for performance
- Cascade deletion for related data

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # Base UI components
│   │   │   └── navigation/ # Navigation components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Design system and styles
│   │   └── hooks/         # Custom React hooks
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── database/         # Database schema
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── assets/               # Documentation assets
└── package.json          # Root package.json
```

## 🎨 Design System

FreelancePro features a comprehensive design system with:

### Color Palette
- **Primary**: Cosmic purples and magentas
- **Secondary**: Electric blues and cyans
- **Accent**: Vibrant oranges and reds
- **Success**: Emerald greens
- **Warning**: Golden yellows

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable text
- **Code**: Monospace for technical content

### Components
- **Cards**: Glassmorphism with glowing borders
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Dark themes with accent borders
- **Tables**: Responsive with mobile optimization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment
1. Build the client: `npm run build`
2. Set up production database
3. Configure environment variables
4. Deploy to your preferred hosting platform

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure responsive design
- Test across different devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [Wiki](https://github.com/zafor158/Lightweight-CRM-for-Freelancers/wiki)
- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/zafor158/Lightweight-CRM-for-Freelancers/issues)
- **Discussions**: Join the conversation in [GitHub Discussions](https://github.com/zafor158/Lightweight-CRM-for-Freelancers/discussions)

## 🙏 Acknowledgments

- **Stripe** for payment processing
- **React** team for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Lucide** for beautiful icons
- **PostgreSQL** for reliable database

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

*Built with ❤️ for the freelancing community*

</div>
