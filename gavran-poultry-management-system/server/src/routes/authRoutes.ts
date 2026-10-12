import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database';
import authMiddleware from '../middleware/authMiddleware';
import requireRole from '../middleware/roleMiddleware';

const router = express.Router();

// POST /api/auth/register - Register new user (owner only)
router.post('/register', requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const { name, phone, password, role } = req.body;

    // Check if user already exists
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, phone, hashedPassword, role || 'worker']
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: (result as any).insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    // Find user by phone
    const [rows] = await pool.execute(
      'SELECT id, name, phone, password_hash, role, active FROM users WHERE phone = ?',
      [phone]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0] as any;

    // Check if user is active
    if (!user.active) {
      return res.status(400).json({ message: 'User account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// GET /api/auth/me - Get current user details
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, phone, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: rows[0]
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ message: 'Internal server error while fetching user details' });
  }
});

export default router;