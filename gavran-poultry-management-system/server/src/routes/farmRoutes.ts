import express, { Request, Response } from 'express';
import pool from '../database';
import authMiddleware from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { z } from 'zod';

const router = express.Router();

// Zod schema for farm validation
const farmSchema = z.object({
  name: z.string().min(1, "Farm name is required"),
  address: z.string().optional(),
});

// GET /api/farms - Get all farms (with pagination)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT f.id, f.name, f.address, f.created_at, 
             u.name as owner_name
      FROM farms f
      JOIN users u ON f.owner_id = u.id
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM farms f
      JOIN users u ON f.owner_id = u.id
    `;

    // Add filtering for workers (only their farms)
    if (req.user?.role === 'worker') {
      query += ` WHERE f.owner_id = ?`;
      countQuery += ` WHERE f.owner_id = ?`;
    }

    query += ` ORDER BY f.created_at DESC LIMIT ? OFFSET ?`;

    let params: any[] = [];
    if (req.user?.role === 'worker') {
      params.push(req.user.id);
    }
    
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    const [[countRow]] = await pool.execute(countQuery, req.user?.role === 'worker' ? [req.user.id] : []);

    res.json({
      farms: rows,
      pagination: {
        page,
        limit,
        total: countRow.total,
        pages: Math.ceil(countRow.total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching farms:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/farms/:id - Get specific farm
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    let query = `
      SELECT f.id, f.name, f.address, f.created_at, 
             u.name as owner_name
      FROM farms f
      JOIN users u ON f.owner_id = u.id
      WHERE f.id = ?
    `;

    // Add filtering for workers (only their farms)
    if (req.user?.role === 'worker') {
      query += ` AND f.owner_id = ?`;
    }

    const [rows] = await pool.execute(query, req.user?.role === 'worker' ? [id, req.user.id] : [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching farm:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/farms - Create new farm
router.post('/', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = farmSchema.parse(req.body);
    
    const { name, address } = validatedData;

    // Insert farm
    const [result] = await pool.execute(
      'INSERT INTO farms (name, address, owner_id) VALUES (?, ?, ?)',
      [name, address, req.user?.id]
    );

    res.status(201).json({
      message: 'Farm created successfully',
      farmId: (result as any).insertId,
      ...validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Error creating farm:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/farms/:id - Update farm
router.put('/:id', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = farmSchema.parse(req.body);
    
    const { name, address } = validatedData;

    // Update farm
    const [result] = await pool.execute(
      'UPDATE farms SET name = ?, address = ? WHERE id = ?',
      [name, address, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.json({
      message: 'Farm updated successfully',
      farmId: id,
      ...validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Error updating farm:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/farms/:id - Delete farm
router.delete('/:id', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if farm exists and verify ownership
    const [rows] = await pool.execute('SELECT id FROM farms WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Delete farm
    const [result] = await pool.execute('DELETE FROM farms WHERE id = ?', [id]);

    res.json({
      message: 'Farm deleted successfully',
      farmId: id
    });
  } catch (error) {
    console.error('Error deleting farm:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;