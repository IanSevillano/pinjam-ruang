// models/riwayatPeminjamanModel.ts
import pool from "../lib/db";

// Get all with join detailata
export async function getAllRiwayatPeminjaman() {
  const [rows] = await pool.query(`
    SELECT rp.id, rp.id_peminjaman, rp.catatan,
           p.nama_kegiatan,
           DATE_FORMAT(p.waktu_peminjaman_mulai, '%Y-%m-%d %H:%i:%s') AS waktu_peminjaman_mulai,
           DATE_FORMAT(p.waktu_peminjaman_selesai, '%Y-%m-%d %H:%i:%s') AS waktu_peminjaman_selesai,
           u.nama_lengkap, u.no_hp,
           r.nama_ruangan,
           g.kode_gedung, g.nama_gedung
    FROM tb_riwayat_peminjaman rp
    LEFT JOIN tb_peminjaman p ON rp.id_peminjaman = p.id
    LEFT JOIN tb_users u ON p.id_users = u.id
    LEFT JOIN tb_ruangan r ON p.id_ruangan = r.id
    LEFT JOIN tb_gedung g ON r.id_gedung = g.id
    ORDER BY rp.id ASC
  `);
  return rows;
}

// Get by id with join detail
export async function getRiwayatPeminjamanById(id: number) {
  const [rows]: any = await pool.query(`
    SELECT rp.id, rp.id_peminjaman, rp.catatan,
           p.nama_kegiatan,
           DATE_FORMAT(p.waktu_peminjaman_mulai, '%Y-%m-%d %H:%i:%s') AS waktu_peminjaman_mulai,
           DATE_FORMAT(p.waktu_peminjaman_selesai, '%Y-%m-%d %H:%i:%s') AS waktu_peminjaman_selesai,
           u.nama_lengkap, u.no_hp,
           r.nama_ruangan,
           g.kode_gedung, g.nama_gedung
    FROM tb_riwayat_peminjaman rp
    LEFT JOIN tb_peminjaman p ON rp.id_peminjaman = p.id
    LEFT JOIN tb_users u ON p.id_users = u.id
    LEFT JOIN tb_ruangan r ON p.id_ruangan = r.id
    LEFT JOIN tb_gedung g ON r.id_gedung = g.id
    WHERE rp.id = ?
  `, [id]);
  return rows[0];
}



// Create
export async function createRiwayatPeminjaman(data: { id_peminjaman: number; catatan: string }) {
  const [result]: any = await pool.query(
    "INSERT INTO tb_riwayat_peminjaman (id_peminjaman, catatan) VALUES (?, ?)",
    [data.id_peminjaman, data.catatan]
  );
  return result.insertId;
}

// Update
export async function updateRiwayatPeminjaman(id: number, data: { id_peminjaman: number; catatan: string }) {
  await pool.query(
    "UPDATE tb_riwayat_peminjaman SET id_peminjaman = ?, catatan = ? WHERE id = ?",
    [data.id_peminjaman, data.catatan, id]
  );
}

// Delete
export async function deleteRiwayatPeminjaman(id: number) {
  await pool.query("DELETE FROM tb_riwayat_peminjaman WHERE id = ?", [id]);
}
