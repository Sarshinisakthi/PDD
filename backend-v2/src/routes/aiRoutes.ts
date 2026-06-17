import { Router } from 'express';
import { getAISummary } from '../controllers/aiController';
import { requireAuth } from '../middlewares/auth';

const router = Router();
router.post('/summary', requireAuth, getAISummary);

export default router;
