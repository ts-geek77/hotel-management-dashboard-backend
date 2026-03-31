import { z } from 'zod';

export const validateRequestData = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.issues.map(e => e.message)
    };
  }
  return {
    success: true as const,
    data: result.data
  };
};

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Guest Schemas
export const createGuestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
});
export type CreateGuestZodInput = z.infer<typeof createGuestSchema>;

// Booking Schemas
export const createBookingSchema = z.object({
  guestId: z.number().int().positive(),
  roomId: z.number().int().positive(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  status: z.enum(['Booked', 'Pending', 'Cancelled', 'Checked In', 'Checked Out']).optional()
});
export type CreateBookingZodInput = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = z.object({
  guestId: z.number().int().positive().optional(),
  roomId: z.number().int().positive().optional(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  status: z.enum(['Booked', 'Pending', 'Cancelled', 'Checked In', 'Checked Out']).optional(),
  price: z.number().positive().optional()
});
export type UpdateBookingZodInput = z.infer<typeof updateBookingSchema>;

// Room Schemas
export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  roomType: z.enum(['Single', 'Double', 'Deluxe'], { error: 'Invalid room type', message: 'Room type is required' }),
  price: z.number().positive('Price must be positive'),
  status: z.enum(['Available', 'Booked', 'Maintenance']).optional()
});
export type CreateRoomZodInput = z.infer<typeof createRoomSchema>;

export const updateRoomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required').optional(),
  roomType: z.enum(['Single', 'Double', 'Deluxe'], { error: 'Invalid room type' }).optional(),
  price: z.number().positive('Price must be positive').optional(),
  status: z.enum(['Available', 'Booked', 'Maintenance']).optional()
});
export type UpdateRoomZodInput = z.infer<typeof updateRoomSchema>;
