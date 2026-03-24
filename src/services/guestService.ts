import { pool } from '../config';
import { GuestListEntry, GuestDetail, Booking } from '../types';

export const getAllGuests = async (): Promise<GuestListEntry[]> => {
  const query = 'SELECT id, name, email, phone FROM guests ORDER BY name ASC';
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
