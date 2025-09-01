//models/userModel.ts

import db from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { generateToken } from "@/lib/mailer";

export interface User {
  id?: number;
  email: string;
  username: string;
  nama_lengkap: string;
  jenis_kelamin?: "L" | "P";
  tgl_lahir?: string;
  no_hp?: string;
  alamat?: string;
  id_pengenal: string;             
  requested_role_id?: number|null; 
  password: string;
  token_verifikasi?: string | null;
  token_expires?: Date | null; 
  is_verified?: number;
  is_active?: number;
}

export const getUserByEmail = async (email: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM tb_users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

export const createUser = async (user: User) => {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO tb_users 
      (email, username, nama_lengkap, jenis_kelamin, tgl_lahir, no_hp, alamat, id_pengenal, requested_role_id, password, token_verifikasi, is_verified, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.email,
      user.username,
      user.nama_lengkap,
      user.jenis_kelamin || null,
      user.tgl_lahir || null,
      user.no_hp || null,
      user.alamat || null,
      user.id_pengenal,        
      user.requested_role_id || null,
      user.password,
      user.token_verifikasi || null,
      user.is_verified ?? 0,
      user.is_active ?? 0,
    ]
  );
  return result.insertId;
};


// ✅ Fungsi untuk mengaktifkan user berdasarkan token verifikasi
export const activateUser = async (token: string) => {
  const [result] = await db.query(
    `UPDATE tb_users 
     SET is_verified = 1, token_verifikasi = NULL 
     WHERE token_verifikasi = ?`,
    [token]
  );
  return (result as any).affectedRows > 0;
};





// ==== Fungsi dari model lama (Sudah diintegrasikan tipe User) ====

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await db.query<User[] & RowDataPacket[]>("SELECT * FROM tb_users");
  return rows;
};

// Get user by ID
export const getUserById = async (id: number): Promise<User | null> => {
  const [rows] = await db.query<User[] & RowDataPacket[]>(
    "SELECT * FROM tb_users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};


// export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
//   const {
//     username,
//     nama_lengkap,
//     jenis_kelamin,
//     tgl_lahir,
//     no_hp,
//     alamat,
//   } = user;

//   await db.query<ResultSetHeader>(
//     `UPDATE tb_users 
//      SET username = ?, nama_lengkap = ?, jenis_kelamin = ?, tgl_lahir = ?, no_hp = ?, alamat = ?
//      WHERE id = ?`,
//     [
//       username,
//       nama_lengkap,
//       jenis_kelamin || null,
//       tgl_lahir || null,
//       no_hp || null,
//       alamat || null,
//       id,
//     ]
//   );
// };

export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
  const {
    username,
    nama_lengkap,
    jenis_kelamin,
    tgl_lahir,
    no_hp,
    alamat,
  } = user;

  // Konversi format tanggal ISO ke format YYYY-MM-DD untuk MySQL
  let formattedTglLahir = null;
  if (tgl_lahir) {
    const date = new Date(tgl_lahir);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedTglLahir = `${year}-${month}-${day}`;
    }
  }

  await db.query<ResultSetHeader>(
    `UPDATE tb_users 
     SET username = ?, nama_lengkap = ?, jenis_kelamin = ?, tgl_lahir = ?, no_hp = ?, alamat = ?
     WHERE id = ?`,
    [
      username,
      nama_lengkap,
      jenis_kelamin || null,
      formattedTglLahir,
      no_hp || null,
      alamat || null,
      id,
    ]
  );
};


// Soft delete user
export const deleteUser = async (id: number): Promise<void> => {
  await db.query<ResultSetHeader>(
    "UPDATE tb_users SET is_active = 0 WHERE id = ?",
    [id]
  );
};

// Aktifkan user (tanpa verifikasi token, langsung aktifkan)
export const activateUserById = async (id: number): Promise<void> => {
  await db.query<ResultSetHeader>(
    "UPDATE tb_users SET is_active = 1 WHERE id = ?",
    [id]
  );
};




// models/userModel.ts

// Simpan token reset password
export const setPasswordResetToken = async (email: string, token: string, expires: Date) => {
  await db.query<ResultSetHeader>(
    `UPDATE tb_users 
     SET token_verifikasi = ?, token_expires = ?
     WHERE email = ?`,
    [token, expires, email]
  );
};

// Verifikasi token reset password
export const checkPasswordResetToken = async (email: string, token: string): Promise<boolean> => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT id, token_expires FROM tb_users 
     WHERE email = ? 
     AND token_verifikasi = ?`,
    [email, token]
  );

  if (rows.length === 0) return false;

  const { token_expires } = rows[0];

  // Kalau sudah kadaluarsa, hapus token & return false
  if (new Date(token_expires) <= new Date()) {
    await db.query<ResultSetHeader>(
      `UPDATE tb_users 
       SET token_verifikasi = NULL, token_expires = NULL
       WHERE email = ?`,
      [email]
    );
    return false;
  }

  return true;
};

// export const checkPasswordResetToken = async (email: string, token: string): Promise<boolean> => {
//   const [rows] = await db.query<RowDataPacket[]>(
//     `SELECT id FROM tb_users 
//      WHERE email = ? 
//      AND token_verifikasi = ? 
//      AND token_expires > NOW()`,
//     [email, token]
//   );
//   return rows.length > 0;
// };


// Ubah password (khusus reset)
export const resetUserPassword = async (email: string, newPassword: string) => {
  await db.query<ResultSetHeader>(
    `UPDATE tb_users 
     SET password = ?, token_verifikasi = NULL, token_expires = NULL
     WHERE email = ?`,
    [newPassword, email]
  );
};


