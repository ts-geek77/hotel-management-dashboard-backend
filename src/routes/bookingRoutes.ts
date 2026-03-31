import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { protect } from '../middleware';

const router = Router();

router.use(protect);

router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

export default router;
