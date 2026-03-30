import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { protect } from '../middleware';

const router = Router();

// Dashboard routes - all protected by auth
router.get('/', protect, dashboardController.getDashboardData);

export default router;
