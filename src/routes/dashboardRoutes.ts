import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { protect } from '../middleware';

const router = Router();

// Dashboard routes - all protected by auth
router.get('/stats', protect, dashboardController.getDashboardStats);
router.get('/revenue-trends', protect, dashboardController.getRevenueTrends);
router.get('/recent-bookings', protect, dashboardController.getRecentBookings);
router.get('/room-status', protect, dashboardController.getRoomStatus);

export default router;
