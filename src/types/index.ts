export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JWTPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  activeBookings: number;
  checkedInGuests: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  roomNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GuestListEntry {
  id: number;
  name: string;
  email: string;
  phone: string;
  roomNumber?: string;
}

export interface GuestDetail extends Guest {
  bookingHistory: Booking[];
}

export interface CreateGuestInput {
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: number;
  guestId?: number;
  guestName?: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'Booked' | 'Pending' | 'Cancelled' | 'Checked In' | 'Checked Out';
  price: number;
  userId?: string;
  roomId?: number;
  roomNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBookingInput {
  guestId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status?: 'Booked' | 'Pending' | 'Cancelled' | 'Checked In' | 'Checked Out';
}

export interface UpdateBookingInput {
  guestId?: number;
  roomId?: number;
  checkIn?: string;
  checkOut?: string;
  status?: 'Booked' | 'Pending' | 'Cancelled' | 'Checked In' | 'Checked Out';
  price?: number;
}

export interface RoomStatus {
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Deluxe';
  status: 'Available' | 'Booked' | 'Maintenance';
}

export interface Room {
  id: number;
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Deluxe';
  price: number;
  status: 'Available' | 'Booked' | 'Maintenance';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRoomInput {
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Deluxe';
  price: number;
  status?: 'Available' | 'Booked' | 'Maintenance';
}

export interface UpdateRoomInput {
  roomNumber?: string;
  roomType?: 'Single' | 'Double' | 'Deluxe';
  price?: number;
  status?: 'Available' | 'Booked' | 'Maintenance';
}

export interface DashboardData {
  stats: DashboardStats;
  revenueTrends: RevenueTrend[];
  recentBookings: Booking[];
  roomStatus: RoomStatus[];
}
