import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboardService';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const stats = await dashboardService.getStats();
    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export const getRevenueTrends = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const trends = await dashboardService.getRevenueTrends();
    return res.status(200).json(trends);
  } catch (error) {
    next(error);
  }
};

export const getRecentBookings = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const bookings = await dashboardService.getRecentBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getRoomStatus = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const status = await dashboardService.getRoomStatus();
    return res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};
