import { Router } from 'express';
import { login, register, forgotPassword, getProfile, logout } from '../controllers';
import { protect } from '../middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);

router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);

export default router;
