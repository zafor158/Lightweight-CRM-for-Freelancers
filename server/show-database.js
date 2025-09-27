const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function showDatabase() {
  try {
    console.log('🔍 Database Connection Test');
    console.log('=' .repeat(50));
    
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database successfully!\n');
    
    // Show all tables
    const tablesResult = await client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('📋 Available Tables:');
    console.log('-'.repeat(30));
    tablesResult.rows.forEach(row => {
      console.log(`  • ${row.table_name} (${row.table_type})`);
    });
    console.log('');
    
    // Show table structures
    for (const table of tablesResult.rows) {
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position;
      `, [table.table_name]);
      
      console.log(`📊 Table: ${table.table_name.toUpperCase()}`);
      console.log('-'.repeat(40));
      columnsResult.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  ${col.column_name.padEnd(20)} | ${col.data_type.padEnd(15)} | ${nullable}${defaultVal}`);
      });
      console.log('');
    }
    
    // Show data counts
    console.log('📈 Data Summary:');
    console.log('-'.repeat(30));
    
    for (const table of tablesResult.rows) {
      const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
      console.log(`  ${table.table_name.padEnd(15)} | ${countResult.rows[0].count} records`);
    }
    console.log('');
    
    // Show sample data from each table
    for (const table of tablesResult.rows) {
      const sampleResult = await client.query(`SELECT * FROM ${table.table_name} LIMIT 3`);
      
      if (sampleResult.rows.length > 0) {
        console.log(`📄 Sample Data from ${table.table_name.toUpperCase()}:`);
        console.log('-'.repeat(50));
        
        // Get column names
        const columns = Object.keys(sampleResult.rows[0]);
        console.log(columns.map(col => col.padEnd(15)).join(' | '));
        console.log('-'.repeat(columns.length * 18));
        
        // Show sample rows
        sampleResult.rows.forEach(row => {
          const values = columns.map(col => {
            const value = row[col];
            if (value === null) return 'NULL'.padEnd(15);
            if (typeof value === 'string' && value.length > 12) {
              return (value.substring(0, 12) + '...').padEnd(15);
            }
            return String(value).padEnd(15);
          });
          console.log(values.join(' | '));
        });
        console.log('');
      }
    }
    
    // Show specific data for Invoice Generator
    console.log('🎯 Invoice Generator Data:');
    console.log('-'.repeat(40));
    
    // Users
    const usersResult = await client.query('SELECT id, name, email FROM users LIMIT 5');
    console.log('👥 Users:');
    usersResult.rows.forEach(user => {
      console.log(`  ID: ${user.id} | ${user.name} | ${user.email}`);
    });
    console.log('');
    
    // Clients
    const clientsResult = await client.query('SELECT id, name, email, company FROM clients LIMIT 5');
    console.log('🏢 Clients:');
    clientsResult.rows.forEach(client => {
      console.log(`  ID: ${client.id} | ${client.name} | ${client.email} | ${client.company || 'N/A'}`);
    });
    console.log('');
    
    // Projects
    const projectsResult = await client.query(`
      SELECT p.id, p.name, p.status, p.total_amount, c.name as client_name 
      FROM projects p 
      LEFT JOIN clients c ON p.client_id = c.id 
      LIMIT 5
    `);
    console.log('📁 Projects:');
    projectsResult.rows.forEach(project => {
      console.log(`  ID: ${project.id} | ${project.name} | ${project.status} | $${project.total_amount || 0} | Client: ${project.client_name || 'N/A'}`);
    });
    console.log('');
    
    // Invoices
    const invoicesResult = await client.query(`
      SELECT i.id, i.invoice_number, i.amount, i.status, p.name as project_name 
      FROM invoices i 
      LEFT JOIN projects p ON i.project_id = p.id 
      LIMIT 5
    `);
    console.log('💰 Invoices:');
    invoicesResult.rows.forEach(invoice => {
      console.log(`  ID: ${invoice.id} | ${invoice.invoice_number} | $${invoice.amount} | ${invoice.status} | Project: ${invoice.project_name || 'N/A'}`);
    });
    console.log('');
    
    // Check for completed projects (needed for Invoice Generator)
    const completedProjectsResult = await client.query(`
      SELECT COUNT(*) as count 
      FROM projects 
      WHERE status = 'Completed'
    `);
    console.log(`✅ Completed Projects: ${completedProjectsResult.rows[0].count}`);
    
    // Check for billable projects (completed but not invoiced)
    const billableProjectsResult = await client.query(`
      SELECT COUNT(*) as count 
      FROM projects p
      WHERE p.status = 'Completed'
        AND p.id NOT IN (
          SELECT DISTINCT project_id 
          FROM invoices 
          WHERE project_id IS NOT NULL 
            AND status IN ('Sent', 'Paid')
        )
    `);
    console.log(`💰 Billable Projects (not invoiced): ${billableProjectsResult.rows[0].count}`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

showDatabase();
