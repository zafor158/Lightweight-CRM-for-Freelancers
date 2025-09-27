const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${timestamp}-${random}`;
};

// Get all invoices for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { status, project_id } = req.query;
    
    let query = `
      SELECT i.*, p.name as project_name, c.name as client_name
      FROM invoices i
      JOIN projects p ON i.project_id = p.id
      JOIN clients c ON p.client_id = c.id
      WHERE i.user_id = $1
    `;
    
    const queryParams = [req.user.id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND i.status = $${paramCount}`;
      queryParams.push(status);
    }

    if (project_id) {
      paramCount++;
      query += ` AND i.project_id = $${paramCount}`;
      queryParams.push(project_id);
    }

    query += ' ORDER BY i.created_at DESC';

    const result = await pool.query(query, queryParams);

    res.json({ invoices: result.rows });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Handle "new" route for creating new invoice
    if (id === 'new') {
      return res.json({ invoice: null, isNew: true });
    }

    const result = await pool.query(
      `SELECT i.*, p.name as project_name, p.description as project_description,
              c.name as client_name, c.email as client_email, c.phone as client_phone, 
              c.company as client_company, c.address as client_address
       FROM invoices i
       JOIN projects p ON i.project_id = p.id
       JOIN clients c ON p.client_id = c.id
       WHERE i.id = $1 AND i.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ invoice: result.rows[0] });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new invoice
router.post('/', async (req, res) => {
  try {
    const { 
      project_id, amount, due_date, description, 
      tax_rate, discount, notes, payment_terms, currency 
    } = req.body;

    if (!project_id || !amount) {
      return res.status(400).json({ message: 'Project ID and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Verify project belongs to user
    const projectResult = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [project_id, req.user.id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(400).json({ message: 'Project not found' });
    }

    const invoiceNumber = generateInvoiceNumber();

    const result = await pool.query(
      `INSERT INTO invoices (project_id, user_id, invoice_number, amount, due_date, description, tax_rate, discount, notes, payment_terms, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [project_id, req.user.id, invoiceNumber, amount, due_date, description, tax_rate || 0, discount || 0, notes, payment_terms || 30, currency || 'USD']
    );

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: result.rows[0]
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an invoice
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, due_date, description, status } = req.body;

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Check if invoice exists and belongs to user
    const existingInvoice = await pool.query(
      'SELECT id, status FROM invoices WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingInvoice.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Don't allow editing paid invoices
    if (existingInvoice.rows[0].status === 'Paid') {
      return res.status(400).json({ message: 'Cannot edit paid invoices' });
    }

    const result = await pool.query(
      `UPDATE invoices 
       SET amount = COALESCE($1, amount), 
           due_date = COALESCE($2, due_date), 
           description = COALESCE($3, description),
           status = COALESCE($4, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [amount, due_date, description, status, id, req.user.id]
    );

    res.json({
      message: 'Invoice updated successfully',
      invoice: result.rows[0]
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an invoice
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if invoice exists and belongs to user
    const existingInvoice = await pool.query(
      'SELECT id, status FROM invoices WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingInvoice.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Don't allow deleting paid invoices
    if (existingInvoice.rows[0].status === 'Paid') {
      return res.status(400).json({ message: 'Cannot delete paid invoices' });
    }

    await pool.query(
      'DELETE FROM invoices WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update invoice status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Draft', 'Sent', 'Paid', 'Overdue'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    // Check if invoice exists and belongs to user
    const existingInvoice = await pool.query(
      'SELECT id FROM invoices WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingInvoice.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const result = await pool.query(
      `UPDATE invoices 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, id, req.user.id]
    );

    res.json({
      message: 'Invoice status updated successfully',
      invoice: result.rows[0]
    });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get clients with their billable projects for invoice generator
router.get('/generator/clients', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT c.id, c.name, c.email, c.company
       FROM clients c
       JOIN projects p ON c.id = p.client_id
       WHERE c.user_id = $1 AND p.status = 'Completed'
       ORDER BY c.name`,
      [req.user.id]
    );

    res.json({ clients: result.rows });
  } catch (error) {
    console.error('Get clients for generator error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get billable projects for a specific client
router.get('/generator/clients/:clientId/projects', async (req, res) => {
  try {
    const { clientId } = req.params;

    // Verify client belongs to user
    const clientResult = await pool.query(
      'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
      [clientId, req.user.id]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Get completed projects that haven't been invoiced
    const result = await pool.query(
      `SELECT p.id, p.name, p.description, p.total_amount, p.due_date, p.created_at
       FROM projects p
       WHERE p.client_id = $1 
         AND p.user_id = $2 
         AND p.status = 'Completed'
         AND p.id NOT IN (
           SELECT DISTINCT project_id 
           FROM invoices 
           WHERE project_id IS NOT NULL 
             AND status IN ('Sent', 'Paid')
         )
       ORDER BY p.created_at DESC`,
      [clientId, req.user.id]
    );

    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Get billable projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create invoice from multiple projects
router.post('/generator/create', async (req, res) => {
  try {
    const { 
      client_id, 
      project_ids, 
      line_items, 
      due_date, 
      tax_rate, 
      discount, 
      notes, 
      payment_terms, 
      currency,
      status = 'Draft'
    } = req.body;

    if (!client_id || !line_items || line_items.length === 0) {
      return res.status(400).json({ message: 'Client ID and line items are required' });
    }

    // Verify client belongs to user
    const clientResult = await pool.query(
      'SELECT id, name FROM clients WHERE id = $1 AND user_id = $2',
      [client_id, req.user.id]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Calculate total amount
    const subtotal = line_items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = subtotal * (tax_rate || 0) / 100;
    const discountAmount = discount || 0;
    const totalAmount = subtotal + taxAmount - discountAmount;

    if (totalAmount <= 0) {
      return res.status(400).json({ message: 'Total amount must be greater than 0' });
    }

    const invoiceNumber = generateInvoiceNumber();

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create the main invoice (use first project as primary project_id for compatibility)
      const primaryProjectId = project_ids && project_ids.length > 0 ? project_ids[0] : null;
      
      const invoiceResult = await client.query(
        `INSERT INTO invoices (project_id, user_id, invoice_number, amount, due_date, description, tax_rate, discount, notes, payment_terms, currency, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          primaryProjectId, 
          req.user.id, 
          invoiceNumber, 
          totalAmount, 
          due_date, 
          notes || `Invoice for ${clientResult.rows[0].name}`, 
          tax_rate || 0, 
          discountAmount, 
          notes, 
          payment_terms || 30, 
          currency || 'USD',
          status
        ]
      );

      // Create invoice line items (if you have a separate table for line items)
      // For now, we'll store the line items in the description or notes
      const lineItemsDescription = line_items.map(item => 
        `${item.description}: $${item.amount}`
      ).join('\n');

      await client.query(
        'UPDATE invoices SET description = $1 WHERE id = $2',
        [lineItemsDescription, invoiceResult.rows[0].id]
      );

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Invoice created successfully',
        invoice: invoiceResult.rows[0],
        line_items: line_items,
        totals: {
          subtotal,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          total: totalAmount
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Create invoice from generator error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
