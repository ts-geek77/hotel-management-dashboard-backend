import { pool } from '../config';
import { DashboardStats, RevenueTrend, Booking, RoomStatus, DashboardData } from '../types';

export const getStats = async (): Promise<DashboardStats> => {
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM rooms) as "totalRooms",
      (SELECT COUNT(*) FROM rooms WHERE status = 'Available') as "availableRooms",
      (SELECT COUNT(*) FROM bookings WHERE status = 'Booked') as "activeBookings",
      (SELECT COUNT(*) FROM bookings WHERE status = 'Checked In') as "checkedInGuests"
  `;
  const result = await pool.query(statsQuery);
  const row = result.rows[0];
  
  return {
    totalRooms: parseInt(row.totalRooms),
    availableRooms: parseInt(row.availableRooms),
    activeBookings: parseInt(row.activeBookings),
    checkedInGuests: parseInt(row.checkedInGuests)
  };
};

export const getRevenueTrends = async (): Promise<RevenueTrend[]> => {
  const query = `
    SELECT 
      TO_CHAR("createdAt", 'Mon DD') as date,
      SUM(price) as revenue
    FROM bookings
    WHERE "createdAt" >= NOW() - INTERVAL '7 days'
    GROUP BY TO_CHAR("createdAt", 'Mon DD'), "createdAt"
    ORDER BY "createdAt" ASC
  `;
  const result = await pool.query(query);
  return result.rows.map(row => ({
    date: row.date,
    revenue: parseFloat(row.revenue)
  }));
};

export const getRecentBookings = async (): Promise<Booking[]> => {
  const query = `
    SELECT b.id, b."guestId", b."roomType", b."checkIn", b."checkOut", b.status, b.price,
           b."userId", b."roomId", b."createdAt", b."updatedAt",
           g.name as "guestName"
    FROM bookings b
    INNER JOIN guests g ON b."guestId" = g.id
    ORDER BY b."createdAt" DESC 
    LIMIT 5
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getRoomStatus = async (): Promise<RoomStatus[]> => {
  const query = `
    SELECT "roomNumber", "roomType", status 
    FROM rooms 
    ORDER BY "roomNumber" ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getDashboardData = async (): Promise<DashboardData> => {
  const [stats, revenueTrends, recentBookings, roomStatus] = await Promise.all([
    getStats(),
    getRevenueTrends(),
    getRecentBookings(),
    getRoomStatus()
  ]);

  return {
    stats,
    revenueTrends,
    recentBookings,
    roomStatus
  };
};
