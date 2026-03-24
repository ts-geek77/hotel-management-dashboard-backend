import { Router } from 'express';
import { getAllGuests, getGuestById } from '../controllers/guestController';
import { protect } from '../middleware';

const router = Router();

router.use(protect);

router.get('/', getAllGuests);
router.get('/:id', getGuestById);

export default router;
