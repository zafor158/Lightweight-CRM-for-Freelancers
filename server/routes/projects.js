const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all projects for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { status, client_id } = req.query;
    
    let query = `
      SELECT p.*, c.name as client_name, c.email as client_email
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      WHERE p.user_id = $1
    `;
    
    const queryParams = [req.user.id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND p.status = $${paramCount}`;
      queryParams.push(status);
    }

    if (client_id) {
      paramCount++;
      query += ` AND p.client_id = $${paramCount}`;
      queryParams.push(client_id);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, queryParams);

    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Handle "new" route for creating new project
    if (id === 'new') {
      return res.json({ project: null, isNew: true });
    }

    const result = await pool.query(
      `SELECT p.*, c.name as client_name, c.email as client_email, c.phone as client_phone, c.company as client_company
       FROM projects p
       JOIN clients c ON p.client_id = c.id
       WHERE p.id = $1 AND p.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { 
      client_id, name, description, status, due_date, start_date,
      hourly_rate, total_hours, total_amount, budget, priority, project_type, tags 
    } = req.body;

    if (!client_id || !name) {
      return res.status(400).json({ message: 'Client ID and project name are required' });
    }

    // Verify client belongs to user
    const clientResult = await pool.query(
      'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
      [client_id, req.user.id]
    );

    if (clientResult.rows.length === 0) {
      return res.status(400).json({ message: 'Client not found' });
    }

    // Calculate total amount if not provided
    let calculatedAmount = total_amount;
    if (!calculatedAmount && hourly_rate && total_hours) {
      calculatedAmount = hourly_rate * total_hours;
    }

    const result = await pool.query(
      `INSERT INTO projects (client_id, user_id, name, description, status, due_date, start_date, hourly_rate, total_hours, total_amount, budget, priority, project_type, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [client_id, req.user.id, name, description, status || 'In Progress', due_date, start_date, hourly_rate, total_hours, calculatedAmount, budget, priority || 'Medium', project_type || 'Development', tags]
    );

    res.status(201).json({
      message: 'Project created successfully',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { client_id, name, description, status, due_date, hourly_rate, total_hours, total_amount } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    // Check if project exists and belongs to user
    const existingProject = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If client_id is being changed, verify new client belongs to user
    if (client_id) {
      const clientResult = await pool.query(
        'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
        [client_id, req.user.id]
      );

      if (clientResult.rows.length === 0) {
        return res.status(400).json({ message: 'Client not found' });
      }
    }

    // Calculate total amount if not provided
    let calculatedAmount = total_amount;
    if (!calculatedAmount && hourly_rate && total_hours) {
      calculatedAmount = hourly_rate * total_hours;
    }

    const result = await pool.query(
      `UPDATE projects 
       SET client_id = COALESCE($1, client_id), 
           name = $2, 
           description = $3, 
           status = $4, 
           due_date = $5, 
           hourly_rate = $6, 
           total_hours = $7, 
           total_amount = $8, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [client_id, name, description, status, due_date, hourly_rate, total_hours, calculatedAmount, id, req.user.id]
    );

    res.json({
      message: 'Project updated successfully',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists and belongs to user
    const existingProject = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if project has invoices
    const invoicesResult = await pool.query(
      'SELECT COUNT(*) as count FROM invoices WHERE project_id = $1',
      [id]
    );

    if (parseInt(invoicesResult.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete project with existing invoices. Please delete invoices first.' 
      });
    }

    await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update project status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['In Progress', 'Completed', 'Overdue', 'On Hold'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    // Check if project exists and belongs to user
    const existingProject = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const result = await pool.query(
      `UPDATE projects 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [status, id, req.user.id]
    );

    res.json({
      message: 'Project status updated successfully',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
