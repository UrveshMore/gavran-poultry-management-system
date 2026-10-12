import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'poultry_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
});

export default pool;