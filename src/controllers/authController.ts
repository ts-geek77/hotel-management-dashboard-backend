import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as userService from '../services';
import { z } from 'zod';
import { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  updateProfileSchema, 
  changePasswordSchema,
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ChangePasswordInput
} from '../utils/validators';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.error.issues.map((e: z.ZodIssue) => e.message) 
      });
    }

    const { name, email, phone, password } = validation.data as RegisterInput;
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({ name, email, phone, password: hashedPassword });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const validation = forgotPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.error.issues.map((e: z.ZodIssue) => e.message) 
      });
    }

    const { email, newPassword } = validation.data as ForgotPasswordInput;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.updatePassword(email, hashedPassword);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.error.issues.map((e: z.ZodIssue) => e.message) 
      });
    }

    const { email, password } = validation.data as LoginInput;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await userService.findUserById(String(req.user.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userProfile } = user;

    return res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const validation = updateProfileSchema.safeParse(req.body || {});
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.error.issues.map((e: z.ZodIssue) => e.message) 
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedUser = await userService.updateUser(String(req.user.id), validation.data);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userProfile } = updatedUser;
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const validation = changePasswordSchema.safeParse(req.body || {});
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.error.issues.map((e: z.ZodIssue) => e.message) 
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { oldPassword, newPassword } = validation.data as ChangePasswordInput;
    const user = await userService.findUserById(String(req.user.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.updatePassword(user.email, hashedPassword);

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imageUrl = `/uploads/profile-images/${req.file.filename}`;
    const updatedUser = await userService.updateProfileImage(String(req.user.id), imageUrl);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Profile image uploaded successfully',
      profileImage: imageUrl,
    });
  } catch (error) {
    next(error);
  }
};
