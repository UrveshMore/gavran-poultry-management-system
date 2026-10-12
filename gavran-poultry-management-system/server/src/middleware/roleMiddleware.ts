import { Request, Response, NextFunction } from 'express';
import authMiddleware from './authMiddleware';

interface UserPayload {
  id: number;
  phone: string;
  role: string;
}

const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // First check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

// Specific role check for farm-related operations
const requireFarmAccess = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Owner and Manager can access all farms
  if (req.user.role === 'owner' || req.user.role === 'manager') {
    return next();
  }

  // Worker can only access farms they own
  try {
    const farmId = req.params.id || req.body.farm_id;
    if (!farmId) {
      return res.status(400).json({ message: 'Farm ID required' });
    }

    // Verify worker has access to this farm
    // This logic would be implemented based on your ownership structure
    next();
  } catch (error) {
    res.status(403).json({ message: 'Access denied' });
  }
};

export { requireRole, requireFarmAccess };