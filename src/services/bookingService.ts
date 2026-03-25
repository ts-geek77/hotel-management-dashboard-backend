import { pool } from '../config';
import { Booking, CreateBookingInput, UpdateBookingInput } from '../types';

export const getAllBookings = async (): Promise<Booking[]> => {
  const query = `
    SELECT 
      b.*,
      g.name as "guestName",
      r."roomNumber"
    FROM bookings b
    LEFT JOIN guests g ON b."guestId" = g.id
    LEFT JOIN rooms r ON b."roomId" = r.id
    ORDER BY b."createdAt" DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getBookingById = async (id: number): Promise<Booking | null> => {
  const query = `
    SELECT 
      b.*,
      g.name as "guestName",
      r."roomNumber"
    FROM bookings b
    LEFT JOIN guests g ON b."guestId" = g.id
    LEFT JOIN rooms r ON b."roomId" = r.id
    WHERE b.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const createBooking = async (data: CreateBookingInput): Promise<Booking> => {
  const roomQuery = 'SELECT price, "roomType" FROM rooms WHERE id = $1';
  const roomResult = await pool.query(roomQuery, [data.roomId]);
  
  if (roomResult.rows.length === 0) {
    throw new Error('Room not found');
  }
  
  const room = roomResult.rows[0];
  const price = room.price;
  const roomType = room.roomType;

  const query = `
    INSERT INTO bookings ("guestId", "roomId", "roomType", "checkIn", "checkOut", status, price, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    RETURNING *
  `;
  const values = [
    data.guestId,
    data.roomId,
    roomType,
    data.checkIn,
    data.checkOut,
    data.status || 'Booked',
    price
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateBooking = async (id: number, data: UpdateBookingInput): Promise<Booking | null> => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.guestId !== undefined) {
    updates.push(`"guestId" = $${paramIndex++}`);
    values.push(data.guestId);
  }
  if (data.roomId !== undefined) {
    updates.push(`"roomId" = $${paramIndex++}`);
    values.push(data.roomId);

  }
  if (data.checkIn !== undefined) {
    updates.push(`"checkIn" = $${paramIndex++}`);
    values.push(data.checkIn);
  }
  if (data.checkOut !== undefined) {
    updates.push(`"checkOut" = $${paramIndex++}`);
    values.push(data.checkOut);
  }
  if (data.status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    values.push(data.status);
  }
  if (data.price !== undefined) {
    updates.push(`price = $${paramIndex++}`);
    values.push(data.price);
  }

  if (updates.length === 0) return await getBookingById(id);

  updates.push(`"updatedAt" = NOW()`);
  values.push(id);

  const query = `
    UPDATE bookings
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const deleteBooking = async (id: number): Promise<boolean> => {
  const query = 'DELETE FROM bookings WHERE id = $1';
  const result = await pool.query(query, [id]);
  return (result.rowCount ?? 0) > 0;
};
