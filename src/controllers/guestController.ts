import { Request, Response, NextFunction } from 'express';
import * as guestService from '../services/guestService';

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
