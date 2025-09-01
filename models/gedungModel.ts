// models/gedungModel.ts
import pool from "../lib/db";

export async function getAllGedung() {
  const [rows] = await pool.query("SELECT * FROM tb_gedung ORDER BY id asc");
  return rows;
}

export async function getGedungById(id: number) {
  const [rows]: any = await pool.query("SELECT * FROM tb_gedung WHERE id = ?", [id]);
  return rows[0];
}

export async function createGedung(data: { kode_gedung: string; nama_gedung: string }) {
  const [result]: any = await pool.query(
    "INSERT INTO tb_gedung (kode_gedung, nama_gedung) VALUES (?, ?)",
    [data.kode_gedung, data.nama_gedung]
  );
  return result.insertId;
}

export async function updateGedung(id: number, data: { kode_gedung: string; nama_gedung: string }) {
  await pool.query(
    "UPDATE tb_gedung SET kode_gedung = ?, nama_gedung = ? WHERE id = ?",
    [data.kode_gedung, data.nama_gedung, id]
  );
}

export async function deleteGedung(id: number) {
  await pool.query("DELETE FROM tb_gedung WHERE id = ?", [id]);
}