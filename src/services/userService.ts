import { pool } from '../config';
import { User } from '../types';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const createUser = async (data: { name: string; email: string; phone?: string; password: string }): Promise<User> => {
  const { name, email, phone, password } = data;
  const query = `
    INSERT INTO users (name, email, phone, password, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *
  `;
  const result = await pool.query(query, [name, email, phone , password]);
  return result.rows[0];
};

export const updatePassword = async (email: string, password: string): Promise<User | null> => {
  const query = `
    UPDATE users 
    SET password = $1, "updatedAt" = NOW() 
    WHERE email = $2 
    RETURNING *
  `;
  const result = await pool.query(query, [password, email]);
  return result.rows[0] || null;
};

export const updateUser = async (id: string, data: { name?: string; phone?: string }): Promise<User | null> => {
  const { name, phone } = data;
  const query = `
    UPDATE users 
    SET name = COALESCE($1, name), phone = COALESCE($2, phone), "updatedAt" = NOW() 
    WHERE id = $3 
    RETURNING *
  `;
  const result = await pool.query(query, [name, phone, id]);
  return result.rows[0] || null;
};

export const updateProfileImage = async (id: string, profileImage: string): Promise<User | null> => {
  const query = `
    UPDATE users 
    SET "profileImage" = $1, "updatedAt" = NOW() 
    WHERE id = $2 
    RETURNING *
  `;
  const result = await pool.query(query, [profileImage, id]);
  return result.rows[0] || null;
};
