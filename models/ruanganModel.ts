//models/ruannganModel.ts
import pool from '../lib/db';

export async function getAllRuangan() {
  const [rows] = await pool.query(`
    SELECT r.id, r.nama_ruangan, r.status_ruangan, r.kapasitas, r.fasilitas,
           g.nama_gedung, r.id_gedung
    FROM tb_ruangan r
    LEFT JOIN tb_gedung g ON r.id_gedung = g.id
    ORDER BY r.id ASC
  `);
  return rows;
}

export async function getRuanganById(id: number) {
  const [rows]: any = await pool.query(
    'SELECT * FROM tb_ruangan WHERE id = ?',
    [id]
  );
  return rows[0];
}

export async function createRuangan(data: any) {
  const { id_gedung, status_ruangan, nama_ruangan, kapasitas, fasilitas } = data;
  const [result]: any = await pool.query(
    'INSERT INTO tb_ruangan (id_gedung, status_ruangan, nama_ruangan, kapasitas, fasilitas) VALUES (?, ?, ?, ?, ?)',
    [id_gedung, status_ruangan, nama_ruangan, kapasitas, fasilitas]
  );
  return result.insertId;
}

export async function updateRuangan(id: number, data: any) {
  const { id_gedung, status_ruangan, nama_ruangan, kapasitas, fasilitas } = data;
  await pool.query(
    'UPDATE tb_ruangan SET id_gedung=?, status_ruangan=?, nama_ruangan=?, kapasitas=?, fasilitas=? WHERE id=?',
    [id_gedung, status_ruangan, nama_ruangan, kapasitas, fasilitas, id]
  );
}

export async function deleteRuangan(id: number) {
  await pool.query('DELETE FROM tb_ruangan WHERE id=?', [id]);
}
