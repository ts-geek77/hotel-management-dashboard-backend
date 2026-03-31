import { pool } from '../config';

export const findUserByEmail = async (email: string) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const findUserById = async (id: string) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const createUser = async (data: { name: string; email: string; password: string }) => {
  const { name, email, password } = data;
  const query = `
    INSERT INTO users (name, email, password, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING *
  `;
  const result = await pool.query(query, [name, email, password]);
  return result.rows[0];
};

export const updatePassword = async (email: string, password: string) => {
  const query = `
    UPDATE users 
    SET password = $1, "updatedAt" = NOW() 
    WHERE email = $2 
    RETURNING *
  `;
  const result = await pool.query(query, [password, email]);
  return result.rows[0];
};
