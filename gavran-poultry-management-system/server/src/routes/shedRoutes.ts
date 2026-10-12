import express, { Request, Response } from 'express';
import pool from '../database';
import authMiddleware from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { z } from 'zod';

const router = express.Router();

// Zod schema for shed validation
const shedSchema = z.object({
  farm_id: z.number().positive("Farm ID is required"),
  name: z.string().min(1, "Shed name is required"),
  capacity: z.number().positive("Capacity must be a positive number"),
  type: z.enum(['broiler', 'layer', 'breeding'], "Invalid shed type"),
  status: z.enum(['active', 'inactive', 'maintenance'], "Invalid status"),
});

// GET /api/sheds - Get all sheds (with pagination)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.id, s.name, s.capacity, s.type, s.status, s.created_at,
             f.name as farm_name
      FROM sheds s
      JOIN farms f ON s.farm_id = f.id
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM sheds s
      JOIN farms f ON s.farm_id = f.id
    `;

    // Add filtering based on user role
    if (req.user?.role === 'worker') {
      query += ` WHERE f.owner_id = ?`;
      countQuery += ` WHERE f.owner_id = ?`;
    }

    query += ` ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;

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
      sheds: rows,
      pagination: {
        page,
        limit,
        total: countRow.total,
        pages: Math.ceil(countRow.total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching sheds:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/sheds/:id - Get specific shed
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    let query = `
      SELECT s.id, s.name, s.capacity, s.type, s.status, s.created_at,
             f.name as farm_name
      FROM sheds s
      JOIN farms f ON s.farm_id = f.id
      WHERE s.id = ?
    `;

    // Add filtering for workers (only their sheds)
    if (req.user?.role === 'worker') {
      query += ` AND f.owner_id = ?`;
    }

    const [rows] = await pool.execute(query, req.user?.role === 'worker' ? [id, req.user.id] : [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Shed not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching shed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/sheds - Create new shed
router.post('/', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = shedSchema.parse(req.body);
    
    const { farm_id, name, capacity, type, status } = validatedData;

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

    // Insert shed
    const [result] = await pool.execute(
      'INSERT INTO sheds (farm_id, name, capacity, type, status) VALUES (?, ?, ?, ?, ?)',
      [farm_id, name, capacity, type, status]
    );

    res.status(201).json({
      message: 'Shed created successfully',
      shedId: (result as any).insertId,
      ...validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Error creating shed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/sheds/:id - Update shed
router.put('/:id', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = shedSchema.parse(req.body);
    
    const { farm_id, name, capacity, type, status } = validatedData;

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

    // Update shed
    const [result] = await pool.execute(
      'UPDATE sheds SET farm_id = ?, name = ?, capacity = ?, type = ?, status = ? WHERE id = ?',
      [farm_id, name, capacity, type, status, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Shed not found' });
    }

    res.json({
      message: 'Shed updated successfully',
      shedId: id,
      ...validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Error updating shed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/sheds/:id - Delete shed
router.delete('/:id', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if shed exists
    const [rows] = await pool.execute('SELECT id FROM sheds WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Shed not found' });
    }

    // Delete shed
    const [result] = await pool.execute('DELETE FROM sheds WHERE id = ?', [id]);

    res.json({
      message: 'Shed deleted successfully',
      shedId: id
    });
  } catch (error) {
    console.error('Error deleting shed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;