import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import farmRoutes from './routes/farmRoutes';
import shedRoutes from './routes/shedRoutes';
import incubatorRoutes from './routes/incubatorRoutes';
import incubationBatchRoutes from './routes/incubationBatchRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/sheds', shedRoutes);
app.use('/api/incubators', incubatorRoutes);
app.use('/api/incubation-batches', incubationBatchRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Poultry Management System API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;