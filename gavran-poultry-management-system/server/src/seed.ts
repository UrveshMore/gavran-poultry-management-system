import bcrypt from 'bcrypt';
import pool from './database';

async function seedDatabase() {
  try {
    // Check if owner already exists
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE phone = ?',
      ['9999999999']
    );

    if (existingUser.length > 0) {
      console.log('Owner user already exists');
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('owner123', saltRounds);

    // Insert owner user
    await pool.execute(
      'INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Owner User', '9999999999', hashedPassword, 'owner']
    );

    console.log('Default owner user created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seedDatabase();