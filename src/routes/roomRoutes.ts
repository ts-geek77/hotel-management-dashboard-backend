import { Router } from 'express';
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from '../controllers/roomController';
import { protect } from '../middleware';

const router = Router();

// All room routes are protected
router.use(protect);

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
