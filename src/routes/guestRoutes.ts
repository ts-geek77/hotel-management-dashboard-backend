import { Router } from 'express';
import { getAllGuests, getGuestById, createGuest } from '../controllers/guestController';
import { protect } from '../middleware';

const router = Router();

router.use(protect);

router.get('/', getAllGuests);
router.post('/', createGuest);
router.get('/:id', getGuestById);

export default router;
