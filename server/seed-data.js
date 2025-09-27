const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedData() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    const client = await pool.connect();
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const userResult = await client.query(`
      INSERT INTO users (name, email, password_hash) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (email) DO UPDATE SET 
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash
      RETURNING id, name, email
    `, ['Test User', 'test@example.com', hashedPassword]);
    
    const userId = userResult.rows[0].id;
    console.log(`✅ Created/updated user: ${userResult.rows[0].name} (${userResult.rows[0].email})`);
    
    // Create sample clients
    const clients = [
      {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-0123',
        company: 'Acme Corp',
        address: '123 Business St, City, State 12345'
      },
      {
        name: 'TechStart Inc',
        email: 'hello@techstart.com',
        phone: '+1-555-0456',
        company: 'TechStart Inc',
        address: '456 Innovation Ave, Tech City, TC 67890'
      },
      {
        name: 'Creative Agency',
        email: 'projects@creative.com',
        phone: '+1-555-0789',
        company: 'Creative Agency LLC',
        address: '789 Design Blvd, Creative City, CC 11111'
      }
    ];
    
    const createdClients = [];
    for (const clientData of clients) {
      const clientResult = await client.query(`
        INSERT INTO clients (user_id, name, email, phone, company, address) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        ON CONFLICT DO NOTHING
        RETURNING id, name, email
      `, [userId, clientData.name, clientData.email, clientData.phone, clientData.company, clientData.address]);
      
      if (clientResult.rows.length > 0) {
        createdClients.push(clientResult.rows[0]);
        console.log(`✅ Created client: ${clientResult.rows[0].name}`);
      }
    }
    
    // Create sample projects
    const projects = [
      {
        client_id: createdClients[0]?.id,
        name: 'Website Redesign',
        description: 'Complete website redesign with modern UI/UX',
        status: 'Completed',
        total_amount: 2500.00,
        due_date: new Date('2024-01-15'),
        start_date: new Date('2023-12-01')
      },
      {
        client_id: createdClients[0]?.id,
        name: 'Mobile App Development',
        description: 'iOS and Android mobile application',
        status: 'Completed',
        total_amount: 5000.00,
        due_date: new Date('2024-02-28'),
        start_date: new Date('2024-01-01')
      },
      {
        client_id: createdClients[1]?.id,
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution',
        status: 'Completed',
        total_amount: 7500.00,
        due_date: new Date('2024-03-15'),
        start_date: new Date('2024-01-15')
      },
      {
        client_id: createdClients[1]?.id,
        name: 'API Integration',
        description: 'Third-party API integration and testing',
        status: 'Completed',
        total_amount: 1500.00,
        due_date: new Date('2024-02-10'),
        start_date: new Date('2024-01-20')
      },
      {
        client_id: createdClients[2]?.id,
        name: 'Brand Identity Design',
        description: 'Logo design and brand guidelines',
        status: 'Completed',
        total_amount: 2000.00,
        due_date: new Date('2024-01-30'),
        start_date: new Date('2023-12-15')
      },
      {
        client_id: createdClients[2]?.id,
        name: 'Marketing Campaign',
        description: 'Digital marketing campaign setup',
        status: 'In Progress',
        total_amount: 3000.00,
        due_date: new Date('2024-04-30'),
        start_date: new Date('2024-03-01')
      }
    ];
    
    for (const projectData of projects) {
      if (projectData.client_id) {
        const projectResult = await client.query(`
          INSERT INTO projects (client_id, user_id, name, description, status, total_amount, due_date, start_date) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
          ON CONFLICT DO NOTHING
          RETURNING id, name, status, total_amount
        `, [
          projectData.client_id, 
          userId, 
          projectData.name, 
          projectData.description, 
          projectData.status, 
          projectData.total_amount, 
          projectData.due_date, 
          projectData.start_date
        ]);
        
        if (projectResult.rows.length > 0) {
          console.log(`✅ Created project: ${projectResult.rows[0].name} (${projectResult.rows[0].status}) - $${projectResult.rows[0].total_amount}`);
        }
      }
    }
    
    // Create one sample invoice to test the system
    const invoiceResult = await client.query(`
      INSERT INTO invoices (project_id, user_id, invoice_number, amount, status, due_date, description) 
      SELECT p.id, $1, 'INV-001', p.total_amount, 'Paid', p.due_date, p.description
      FROM projects p 
      WHERE p.user_id = $1 AND p.status = 'Completed' 
      LIMIT 1
      ON CONFLICT DO NOTHING
      RETURNING invoice_number, amount, status
    `, [userId]);
    
    if (invoiceResult.rows.length > 0) {
      console.log(`✅ Created sample invoice: ${invoiceResult.rows[0].invoice_number} - $${invoiceResult.rows[0].amount} (${invoiceResult.rows[0].status})`);
    }
    
    client.release();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`👤 Users: 1 (test@example.com / password123)`);
    console.log(`🏢 Clients: ${createdClients.length}`);
    console.log(`📁 Projects: 6 (5 completed, 1 in progress)`);
    console.log(`💰 Total billable amount: $18,500`);
    
    console.log('\n🔑 Login credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

seedData();
