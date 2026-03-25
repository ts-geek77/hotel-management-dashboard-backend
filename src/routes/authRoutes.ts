import { Router } from 'express';
import { login, register, forgotPassword, getProfile, logout, updateProfile, changePassword, uploadProfileImage } from '../controllers';
import { protect, upload } from '../middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/upload-image', protect, upload.single('image'), uploadProfileImage);
router.post('/logout', protect, logout);

export default router;
