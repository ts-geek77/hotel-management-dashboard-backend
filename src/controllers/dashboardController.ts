import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboardService';

export const getDashboardData = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const data = await dashboardService.getDashboardData();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
