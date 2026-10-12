import express, { Request, Response } from 'express';
import pool from '../database';
import authMiddleware from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { z } from 'zod';

const router = express.Router();

// Zod schema for incubation batch validation
const incubationBatchSchema = z.object({
  incubator_id: z.number().positive("Incubator ID is required"),
  eggs_loaded: z.number().positive("Eggs count must be a positive number"),
  source_shed_id: z.number().optional(),
  source_batch_id: z.number().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"Invalid date format. Use YYYY-MM-DD"),
  status: z.enum(['pending', 'incubating', 'completed', 'cancelled'], "Invalid status"),
});

// GET /api/incubation-batches - Get all incubation batches (with pagination)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT ib.id, ib.batch_no, ib.eggs_loaded, ib.start_date, ib.expected_hatch_date, ib.status, ib.created_at,
             i.name as incubator_name, 
             s.name as source_shed_name
      FROM incubation_batches ib
      JOIN incubators i ON ib.incubator_id = i.id
      LEFT JOIN sheds s ON ib.source_shed_id = s.id
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM incubation_batches ib
      JOIN incubators i ON ib.incubator_id = i.id
    `;

    query += ` ORDER BY ib.created_at DESC LIMIT ? OFFSET ?`;
    params: [limit, offset];

    const [rows] = await pool.execute(query, [limit, offset]);
    const [[countRow]] = await pool.execute(countQuery);

    res.json({
      batches: rows,
      pagination: {
        page,
        limit,
        total: countRow.total,
        pages: Math.ceil(countRow.total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching incubation batches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/incubation-batches/:id - Get specific incubation batch
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT ib.id, ib.batch_no, ib.eggs_loaded, ib.start_date, ib.expected_hatch_date, ib.status, ib.created_at,
             ib.source_shed_id, ib.source_batch_id, 
             i.name as incubator_name, 
             s.name as source_shed_name
      FROM incubation_batches ib
      JOIN incubators i ON ib.incubator_id = i.id
      LEFT JOIN sheds s ON ib.source_shed_id = s.id
      WHERE ib.id = ?
    `;

    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Incubation batch not found' });
    }

    // Get candling records for this batch
    const candlingQuery = `
      SELECT cr.*, ib.batch_no as batch_no
      FROM candling_records cr
      JOIN incubation_batches ib ON cr.incubation_batch_id = ib.id 
      WHERE cr.incubation_batch_id = ?
      ORDER BY cr.day_no
    `;
    
    const [candlingRows] = await pool.execute(candlingQuery, [id]);

    res.json({
      ...rows[0],
      candling_records: candlingRows
    });
  } catch (error) {
    console.error('Error fetching incubation batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/incubation-batches - Create new incubation batch
router.post('/', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = incubationBatchSchema.parse(req.body);
    
    const { incubator_id, eggs_loaded, source_shed_id, source_batch_id, start_date, status } = validatedData;

    // Calculate expected_hatch_date (21 days from start date)
    const startDate = new Date(start_date);
    const expectedHatchDate = new Date(startDate);
    expectedHatchDate.setDate(expectedHatchDate.getDate() + 21);

    // Generate batch number
    const batchNoQuery = 'SELECT MAX(id) as max_id FROM incubation_batches';
    const [batchNoRows] = await pool.execute(batchNoQuery);
    const batchNumber = `BATCH-${(batchNoRows[0].max_id || 0) + 1}`;

    // Verify incubator exists and user has access
    const incubatorQuery = 'SELECT farm_id FROM incubators WHERE id = ?';
    const [incubatorRows] = await pool.execute(incubatorQuery, [incubator_id]);
    
    if (incubatorRows.length === 0) {
      return res.status(400).json({ message: 'Invalid incubator ID' });
    }

    // Insert incubation batch
    const insertQuery = `
      INSERT INTO incubation_batches 
      (batch_no, incubator_id, eggs_loaded, source_shed_id, source_batch_id, start_date, expected_hatch_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(insertQuery, [
      batchNumber,
      incubator_id,
      eggs_loaded,
      source_shed_id || null,
      source_batch_id || null,
      start_date,
      expectedHatchDate.toISOString().split('T')[0],
      status
    ]);

    res.status(201).json({
      message: 'Incubation batch created successfully',
      batchId: (result as any).insertId,
      batch_no: batchNumber,
      ...validatedData,
      expected_hatch_date: expectedHatchDate.toISOString().split('T')[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Error creating incubation batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/incubation-batches/:id - Update incubation batch
router.put('/:id', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const validatedData = incubationBatchSchema.parse(req.body);
    
    const { incubator_id, eggs_loaded, source_shed_id, source_batch_id, start_date, status } = validatedData;

    // Calculate expected_hatch_date (21 days from start date)
    const startDate = new Date(start_date);
    const expectedHatchDate = new Date(startDate);
    expectedHatchDate.setDate(expectedHatchDate.getDate() + 21);

    // Update incubation batch
    const updateQuery = `
      UPDATE incubation_batches 
      SET incubator_id = ?, eggs_loaded = ?, source_shed_id = ?, source_batch_id = ?, start_date = ?, expected_hatch_date = ?, status = ?
      WHERE id = ?
    `;
    
    const [result] = await pool.execute(updateQuery, [
      incubator_id,
      eggs_loaded,
      source_shed_id || null,
      source_batch_id || null,
      start_date,
      expectedHatchDate.toISOString().split('T')[0],
      status,
      id
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Incubation batch not found' });
    }

    res.json({
      message: 'Incubation batch updated successfully',
      batchId: id,
      ...validatedData,
      expected_hatch_date: expectedHatchDate.toISOString().split('T')[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Error updating incubation batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/incubation-batches/:id - Delete incubation batch
router.delete('/:id', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if batch exists
    const [rows] = await pool.execute('SELECT id FROM incubation_batches WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Incubation batch not found' });
    }

    // Delete incubation batch
    const [result] = await pool.execute('DELETE FROM incubation_batches WHERE id = ?', [id]);

    res.json({
      message: 'Incubation batch deleted successfully',
      batchId: id
    });
  } catch (error) {
    console.error('Error deleting incubation batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/incubation-batches/:id/candling - Add candling record for a batch
router.post('/:id/candling', authMiddleware, requireRole('owner', 'manager'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate request body schema for candling records
    const candlingSchema = z.object({
      day_no: z.number().positive("Day number must be a positive number"),
      fertile: z.number().default(0),
      infertile: z.number().default(0),
      dead: z.number().default(0),
      notes: z.string().optional()
    });

    const validatedData = candlingSchema.parse(req.body);

    const { day_no, fertile, infertile, dead, notes } = validatedData;

    // Verify that the batch exists
    const [batchRows] = await pool.execute('SELECT id FROM incubation_batches WHERE id = ?', [id]);
    
    if (batchRows.length === 0) {
      return res.status(404).json({ message: 'Incubation batch not found' });
    }

    // Insert candling record
    const insertQuery = `
      INSERT INTO candling_records 
      (incubation_batch_id, day_no, fertile, infertile, dead, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(insertQuery, [
      id,
      day_no,
      fertile,
      infertile,
      dead,
      notes || null
    ]);

    res.status(201).json({
      message: 'Candling record added successfully',
      candlingId: (result as any).insertId,
      ...validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Error adding candling record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;