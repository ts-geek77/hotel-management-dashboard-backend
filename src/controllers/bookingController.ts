import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/bookingService';
import { z } from 'zod';
import { createBookingSchema, updateBookingSchema } from '../utils/validators';

export const getAllBookings = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const bookings = await bookingService.getAllBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }
    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const validation = createBookingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.error.issues.map((e: z.ZodIssue) => e.message) 
      });
    }

    const booking = await bookingService.createBooking(validation.data);
    return res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error: any) {
    if (error.message === 'Room not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export const updateBooking = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const validation = updateBookingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.error.issues.map((e: z.ZodIssue) => e.message) 
      });
    }

    const updatedBooking = await bookingService.updateBooking(id, validation.data);
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const success = await bookingService.deleteBooking(id);
    if (!success) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};
