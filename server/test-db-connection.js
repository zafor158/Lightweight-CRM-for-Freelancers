const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Available tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Check users count
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`\n👥 Users in database: ${usersResult.rows[0].count}`);
    
    // Check clients count
    const clientsResult = await client.query('SELECT COUNT(*) as count FROM clients');
    console.log(`🏢 Clients in database: ${clientsResult.rows[0].count}`);
    
    // Check projects count
    const projectsResult = await client.query('SELECT COUNT(*) as count FROM projects');
    console.log(`📁 Projects in database: ${projectsResult.rows[0].count}`);
    
    // Check completed projects
    const completedProjectsResult = await client.query(`
      SELECT COUNT(*) as count 
      FROM projects 
      WHERE status = 'Completed'
    `);
    console.log(`✅ Completed projects: ${completedProjectsResult.rows[0].count}`);
    
    // Check clients with completed projects
    const clientsWithProjectsResult = await client.query(`
      SELECT DISTINCT c.id, c.name, c.email, c.company
      FROM clients c
      JOIN projects p ON c.id = p.client_id
      WHERE p.status = 'Completed'
      ORDER BY c.name
    `);
    
    console.log(`\n🎯 Clients with completed projects: ${clientsWithProjectsResult.rows.length}`);
    clientsWithProjectsResult.rows.forEach(client => {
      console.log(`  - ${client.name} (${client.email}) ${client.company ? `[${client.company}]` : ''}`);
    });
    
    // Check projects that haven't been invoiced
    const billableProjectsResult = await client.query(`
      SELECT p.id, p.name, p.description, p.total_amount, p.due_date, p.created_at, c.name as client_name
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      WHERE p.status = 'Completed'
        AND p.id NOT IN (
          SELECT DISTINCT project_id 
          FROM invoices 
          WHERE project_id IS NOT NULL 
            AND status IN ('Sent', 'Paid')
        )
      ORDER BY p.created_at DESC
    `);
    
    console.log(`\n💰 Billable projects (not yet invoiced): ${billableProjectsResult.rows.length}`);
    billableProjectsResult.rows.forEach(project => {
      console.log(`  - ${project.name} (${project.client_name}) - $${project.total_amount || 0}`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
