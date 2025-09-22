const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all clients for the authenticated user
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
              COUNT(p.id) as project_count,
              COUNT(CASE WHEN p.status = 'In Progress' THEN 1 END) as active_projects
       FROM clients c
       LEFT JOIN projects p ON c.id = p.client_id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    res.json({ clients: result.rows });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific client by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Handle "new" route for creating new client
    if (id === 'new') {
      return res.json({ client: null, isNew: true });
    }

    const clientResult = await pool.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const client = clientResult.rows[0];

    // Get projects for this client
    const projectsResult = await pool.query(
      'SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json({
      client: {
        ...client,
        projects: projectsResult.rows
      }
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new client
router.post('/', async (req, res) => {
  try {
    const { 
      name, email, phone, company, address, notes, 
      website, tax_id, payment_terms, preferred_contact_method 
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Client name is required' });
    }

    const result = await pool.query(
      `INSERT INTO clients (user_id, name, email, phone, company, address, notes, website, tax_id, payment_terms, preferred_contact_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [req.user.id, name, email, phone, company, address, notes, website, tax_id, payment_terms, preferred_contact_method]
    );

    res.status(201).json({
      message: 'Client created successfully',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, email, phone, company, address, notes, 
      website, tax_id, payment_terms, preferred_contact_method 
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Client name is required' });
    }

    // Check if client exists and belongs to user
    const existingClient = await pool.query(
      'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingClient.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const result = await pool.query(
      `UPDATE clients 
       SET name = $1, email = $2, phone = $3, company = $4, address = $5, notes = $6, 
           website = $7, tax_id = $8, payment_terms = $9, preferred_contact_method = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 AND user_id = $12
       RETURNING *`,
      [name, email, phone, company, address, notes, website, tax_id, payment_terms, preferred_contact_method, id, req.user.id]
    );

    res.json({
      message: 'Client updated successfully',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if client exists and belongs to user
    const existingClient = await pool.query(
      'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingClient.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if client has projects
    const projectsResult = await pool.query(
      'SELECT COUNT(*) as count FROM projects WHERE client_id = $1',
      [id]
    );

    if (parseInt(projectsResult.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete client with existing projects. Please delete or reassign projects first.' 
      });
    }

    await pool.query(
      'DELETE FROM clients WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
