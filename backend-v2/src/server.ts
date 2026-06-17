import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/firebase'; // Initialize Firebase
import './config/supabase'; // Initialize Supabase client
import healthRoutes from './routes/healthRoutes';
import reportRoutes from './routes/reportRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('LifeLink v2 Backend API is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
