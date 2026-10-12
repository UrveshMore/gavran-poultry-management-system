import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database';

interface UserPayload {
  id: number;
  phone: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as UserPayload;
    req.user = decoded;

    // Verify user still exists and is active
    const [rows] = await pool.execute(
      'SELECT id, phone, role, active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0 || !(rows[0] as any).active) {
      return res.status(401).json({ message: 'Invalid token. User not found or inactive.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;