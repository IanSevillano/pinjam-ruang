
// models/hakAksesModel.ts
import pool from '../lib/db';

export interface HakAkses {
  id: number;
  id_user: number;
  id_roles: number;
  nama_lengkap?: string;
  username?: string;
  email?: string;
  is_active?: boolean;
  nama_role?: string;
}

export async function getAllHakAkses(): Promise<HakAkses[]> {
  const [rows] = await pool.query(`
    SELECT 
      ha.id, 
      ha.id_user, 
      ha.id_roles AS id_role,
      u.nama_lengkap, 
      u.username, 
      u.email, 
      u.is_active, 
      r.nama_role
    FROM tb_hak_akses ha
    JOIN tb_users u ON ha.id_user = u.id
    JOIN tb_roles r ON ha.id_roles = r.id
    ORDER BY ha.id ASC
  `);
  return rows as HakAkses[];
}

export async function getHakAksesById(id: number): Promise<HakAkses | null> {
  const [rows]: any = await pool.query(`
    SELECT 
      ha.id, 
      ha.id_user, 
      ha.id_roles AS id_role,
      u.nama_lengkap, 
      u.username, 
      u.email, 
      u.is_active, 
      r.nama_role
    FROM tb_hak_akses ha
    JOIN tb_users u ON ha.id_user = u.id
    JOIN tb_roles r ON ha.id_roles = r.id
    WHERE ha.id = ?
  `, [id]);
  return rows.length ? rows[0] : null;
}

export async function createHakAkses(data: { id_user: number, id_roles: number }) {
  // Cek apakah user sudah memiliki role ini
  const [existing]: any = await pool.query(
    `SELECT id FROM tb_hak_akses WHERE id_user = ? AND id_roles = ?`,
    [data.id_user, data.id_roles]
  );
  
  if (existing.length > 0) {
    throw new Error('User sudah memiliki role ini');
  }

  const [result]: any = await pool.query(
    `INSERT INTO tb_hak_akses (id_user, id_roles) VALUES (?, ?)`,
    [data.id_user, data.id_roles]
  );
  return result.insertId;
}

export async function updateHakAkses(id: number, data: { id_roles: number }) {
  // Cek apakah role sudah ada untuk user ini
  const [hakAkses]: any = await pool.query(
    `SELECT id_user FROM tb_hak_akses WHERE id = ?`,
    [id]
  );
  
  if (hakAkses.length === 0) {
    throw new Error('Hak akses tidak ditemukan');
  }

  const id_user = hakAkses[0].id_user;

  const [existing]: any = await pool.query(
    `SELECT id FROM tb_hak_akses WHERE id_user = ? AND id_roles = ? AND id != ?`,
    [id_user, data.id_roles, id]
  );
  
  if (existing.length > 0) {
    throw new Error('User sudah memiliki role ini');
  }

  const [result]: any = await pool.query(
    `UPDATE tb_hak_akses SET id_roles = ? WHERE id = ?`,
    [data.id_roles, id]
  );
  return result.affectedRows > 0;
}

export async function deleteHakAkses(id: number) {
  const [result]: any = await pool.query(
    `DELETE FROM tb_hak_akses WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}