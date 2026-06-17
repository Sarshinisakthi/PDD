import { Router } from 'express';
import { generateReport } from '../controllers/reportController';
import { requireAuth } from '../middlewares/auth';

const router = Router();
router.get('/generate', requireAuth, generateReport);

export default router;
