import { pool } from '../config';
import { Room, CreateRoomInput, UpdateRoomInput } from '../types';

export const getAllRooms = async (filters: { status?: string; type?: string; search?: string }): Promise<Room[]> => {
  let query = 'SELECT * FROM rooms WHERE 1=1';
  const params: any[] = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND status = $${params.length}`;
  }

  if (filters.type) {
    params.push(filters.type);
    query += ` AND "roomType" = $${params.length}`;
  }

  if (filters.search) {
    params.push(`%${filters.search}%`);
    query += ` AND ("roomNumber" ILIKE $${params.length} OR "roomType" ILIKE $${params.length})`;
  }

  query += ' ORDER BY "roomNumber" ASC';

  const result = await pool.query(query, params);
  return result.rows;
};

export const getRoomById = async (id: number): Promise<Room | null> => {
  const query = 'SELECT * FROM rooms WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const createRoom = async (data: CreateRoomInput): Promise<Room> => {
  const { roomNumber, roomType, price, status } = data;
  const query = `
    INSERT INTO rooms ("roomNumber", "roomType", price, status, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *
  `;
  const result = await pool.query(query, [
    roomNumber, 
    roomType, 
    price, 
    status || 'Available'
  ]);
  return result.rows[0];
};

export const updateRoom = async (id: number, data: UpdateRoomInput): Promise<Room | null> => {
  const fields: string[] = [];
  const params: any[] = [id];
  let paramIndex = 2;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      const colName = key === 'roomNumber' || key === 'roomType' ? `"${key}"` : key;
      fields.push(`${colName} = $${paramIndex++}`);
      params.push(value);
    }
  }

  if (fields.length === 0) return getRoomById(id);

  const query = `
    UPDATE rooms 
    SET ${fields.join(', ')}, "updatedAt" = NOW() 
    WHERE id = $1 
    RETURNING *
  `;
  const result = await pool.query(query, params);
  return result.rows[0] || null;
};

export const deleteRoom = async (id: number): Promise<boolean> => {
  const query = 'DELETE FROM rooms WHERE id = $1';
  const result = await pool.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
};
