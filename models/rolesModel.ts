// models/rolesModel.ts
import pool from "@/lib/db";

export async function getAllRoles() {
  const [rows] = await pool.query("SELECT * FROM tb_roles ORDER BY id ASC");
  return rows;
}

export async function getRoleById(id: number) {
  const [rows]: any = await pool.query("SELECT * FROM tb_roles WHERE id = ?", [id]);
  return rows[0];
}

export async function createRole(nama_role: string) {
  const [result]: any = await pool.query(
    "INSERT INTO tb_roles (nama_role) VALUES (?)",
    [nama_role]
  );
  return { id: result.insertId, nama_role };
}

export async function updateRole(id: number, nama_role: string) {
  await pool.query(
    "UPDATE tb_roles SET nama_role = ? WHERE id = ?",
    [nama_role, id]
  );
  return { id, nama_role };
}

export async function deleteRole(id: number) {
  await pool.query("DELETE FROM tb_roles WHERE id = ?", [id]);
  return true;
}
