import { Router } from 'express';
import { getHealthRecords, getLatestHealthRecord, addHealthRecord, simulateHealthRecord, getAlerts, markAlertRead } from '../controllers/healthController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, getHealthRecords);
router.get('/latest', requireAuth, getLatestHealthRecord);
router.post('/', requireAuth, addHealthRecord);
router.post('/simulate', requireAuth, simulateHealthRecord);
router.get('/alerts', requireAuth, getAlerts);
router.patch('/alerts/:id/read', requireAuth, markAlertRead);

export default router;
