import express, { Request, Response } from 'express';
import pool from '../database';
import authMiddleware from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { z } from 'zod';

const router = express.Router();

// Zod schema for incubator validation
const incubatorSchema = z.object({
  farm_id: z.number().positive("Farm ID is required"),
  name: z.string().min(1, "Incubator name is required"),
  capacity: z.number().positive("Capacity must be a positive number"),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  status: z.enum(['active', 'idle', 'maintenance'], "Invalid status"),
});

// GET /api/incubators - Get all incubators (with pagination)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT i.id, i.name, i.capacity, i.temperature, i.humidity, i.status, i.created_at,
             f.name as farm_name
      FROM incubators i
      JOIN farms f ON i.farm_id = f.id
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM incubators i
      JOIN farms f ON i.farm_id = f.id
    `;

    // Add filtering based on user role
    if (req.user?.role === 'worker') {
      query += ` WHERE f.owner_id = ?`;
      countQuery += ` WHERE f.owner_id = ?`;
    }

    query += ` ORDER BY i.created_at DESC LIMIT ? OFFSET ?`;

    let params: any[] = [];
    if (req.user?.role === 'worker') {
      query += ` AND f.owner_id = ?`;
      countQuery += ` AND f.owner_id = ?`;
      params.push(req.user.id);
    }
    
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    const [[countRow]] = await pool.execute(countQuery, req.user?.role === 'worker' ? [req.user.id] : []);

    res.json({
      incubators: rows,
      pagination: {
        page,
        limit,
        total: countRow.total,
        pages: Math.ceil(countRow.total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching incubators:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/incubators/:id - Get specific incubator
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    let query = `
      SELECT i.id, i.name, i.capacity, i.temperature, i.humidity, i.status, i.created_at,
             f.name as farm_name
      FROM incubators i
      JOIN farms f ON i.farm_id = f.id
      WHERE i.id = ?
    `;

    // Add filtering for workers (only their incubators)
    if (req.user?.role === 'worker') {
      query += ` AND f.owner_id = ?`;
    }

    const [rows] = await pool.execute(query, req.user?.role === 'worker' ? [id, req.user.id] : [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching incubator:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/incubators - Create new incubator
router.post('/', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = incubatorSchema.parse(req.body);
    
    const { farm_id, name, capacity, temperature, humidity, status } = validatedData;

    // Verify farm exists and user has access
    if (req.user?.role !== 'owner' && req.user?.role !== 'manager') {
      const [farmCount] = await pool.execute(
        'SELECT id FROM farms WHERE id = ? AND owner_id = ?',
        [farm_id, req.user?.id]
      );
      
      if (farmCount.length === 0) {
        return res.status(403).json({ message: 'Access denied to this farm' });
      }
    }

    // Insert incubator
    const [result] = await pool.execute(
      'INSERT INTO incubators (farm_id, name, capacity, temperature, humidity, status) VALUES (?, ?, ?, ?, ?, ?)',
      [farm_id, name, capacity, temperature, humidity, status]
    );

    res.status(201).json({
      message: 'Incubator created successfully',
      incubatorId: (result as any).insertId,
      ...validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Error creating incubator:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/incubators/:id - Update incubator
router.put('/:id', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = incubatorSchema.parse(req.body);
    
    const { farm_id, name, capacity, temperature, humidity, status } = validatedData;

    // Verify farm exists and user has access
    if (req.user?.role !== 'owner' && req.user?.role !== 'manager') {
      const [farmCount] = await pool.execute(
        'SELECT id FROM farms WHERE id = ? AND owner_id = ?',
        [farm_id, req.user?.id]
      );
      
      if (farmCount.length === 0) {
        return res.status(403).json({ message: 'Access denied to this farm' });
      }
    }

    // Update incubator
    const [result] = await pool.execute(
      'UPDATE incubators SET farm_id = ?, name = ?, capacity = ?, temperature = ?, humidity = ?, status = ? WHERE id = ?',
      [farm_id, name, capacity, temperature, humidity, status, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    res.json({
      message: 'Incubator updated successfully',
      incubatorId: id,
      ...validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Error updating incubator:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/incubators/:id - Delete incubator
router.delete('/:id', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if incubator exists
    const [rows] = await pool.execute('SELECT id FROM incubators WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    // Delete incubator
    const [result] = await pool.execute('DELETE FROM incubators WHERE id = ?', [id]);

    res.json({
      message: 'Incubator deleted successfully',
      incubatorId: id
    });
  } catch (error) {
    console.error('Error deleting incubator:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;