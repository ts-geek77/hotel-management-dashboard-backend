import { Request, Response, NextFunction } from 'express';
import * as guestService from '../services/guestService';
import { z } from 'zod';

export const getAllGuests = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const guests = await guestService.getAllGuests();
    return res.status(200).json(guests);
  } catch (error) {
    next(error);
  }
};

export const getGuestById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid guest ID' });
    }
    
    const guest = await guestService.getGuestById(id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    
    return res.status(200).json(guest);
  } catch (error) {
    next(error);
  }
};

const createGuestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
});

export const createGuest = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const validation = createGuestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.error.issues.map(e => e.message) 
      });
    }

    const newGuest = await guestService.createGuest(validation.data);
    return res.status(201).json(newGuest);
  } catch (error: any) {
    if (error.code === '23505') { // unique violation in Postgres
      return res.status(409).json({ message: 'Email already exists' });
    }
    next(error);
  }
};
