import { Request, Response, NextFunction } from 'express';
import * as roomService from '../services/roomService';
import { CreateRoomInput, UpdateRoomInput } from '../types';

export const getAllRooms = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const { status, type, search } = req.query;
    const rooms = await roomService.getAllRooms({ 
      status: typeof status === 'string' ? status : undefined, 
      type: typeof type === 'string' ? type : undefined, 
      search: typeof search === 'string' ? search : undefined 
    });
    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    const room = await roomService.getRoomById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    return res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const roomData: CreateRoomInput = req.body;
    if (!roomData.roomNumber || !roomData.roomType || !roomData.price) {
      return res.status(400).json({ message: 'Missing required room details (roomNumber, roomType, price)' });
    }
    const newRoom = await roomService.createRoom(roomData);
    return res.status(201).json(newRoom);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    const roomData: UpdateRoomInput = req.body;
    const updatedRoom = await roomService.updateRoom(id, roomData);
    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }
    return res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    const deleted = await roomService.deleteRoom(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Room not found' });
    }
    return res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
