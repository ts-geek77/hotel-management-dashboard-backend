import { pool } from '../config';
import { GuestListEntry, GuestDetail, Booking } from '../types';

export const getAllGuests = async (): Promise<GuestListEntry[]> => {
  const query = `
    SELECT 
      g.id, 
      g.name, 
      g.email, 
      g.phone,
      r."roomNumber"
    FROM guests g
    LEFT JOIN (
      SELECT DISTINCT ON ("guestId") "guestId", "roomId"
      FROM bookings
      ORDER BY "guestId", "checkIn" DESC
    ) b ON g.id = b."guestId"
    LEFT JOIN rooms r ON b."roomId" = r.id
    ORDER BY g.name ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getGuestById = async (id: number): Promise<GuestDetail | null> => {
  const guestQuery = 'SELECT * FROM guests WHERE id = $1';
  const guestResult = await pool.query(guestQuery, [id]);
  
  if (guestResult.rows.length === 0) return null;
  
  const guest = guestResult.rows[0];
  
  const bookingsQuery = `
    SELECT b.*, r."roomNumber"
    FROM bookings b
    LEFT JOIN rooms r ON b."roomId" = r.id
    WHERE b."guestId" = $1
    ORDER BY b."checkIn" DESC
  `;
  const bookingsResult = await pool.query(bookingsQuery, [id]);
  
  return {
    ...guest,
    bookingHistory: bookingsResult.rows
  };
};

export const createGuest = async (data: import('../types').CreateGuestInput): Promise<import('../types').Guest> => {
  const query = `
    INSERT INTO guests (name, email, phone, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING *
  `;
  const result = await pool.query(query, [data.name, data.email, data.phone]);
  return result.rows[0];
};
