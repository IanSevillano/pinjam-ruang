// models/peminjamanModel.ts
import pool from "../lib/db";
import { sendStatusUpdateEmail } from "../lib/mailer";


/**
 * Model functions untuk tb_peminjaman + tb_riwayat_peminjaman + helper untuk dropdown
 */

// ============================
// GET ALL
// ============================

export async function getAllPeminjaman() {
  // Auto expired: cek peminjaman yang melewati 1 hari dari waktu mulai tanpa konfirmasi admin
  const [expiredRows]: any = await pool.query(`
    SELECT id FROM tb_peminjaman
    WHERE status_peminjaman = 'menunggu persetujuan'
      AND waktu_peminjaman_mulai IS NOT NULL
      AND NOW() > DATE_ADD(waktu_peminjaman_mulai, INTERVAL 1 DAY)
  `);

  if (expiredRows.length > 0) {
    for (const row of expiredRows) {
      await pool.query(
        `UPDATE tb_peminjaman SET status_peminjaman = 'expired' WHERE id = ?`,
        [row.id]
      );
      await pool.query(
        `INSERT INTO tb_riwayat_peminjaman (id_peminjaman, catatan)
         VALUES (?, ?)`,
        [row.id, "expired karena tidak dikonfirmasi admin"]
      );
    }
  }

  const [rows] = await pool.query(`
    SELECT
      p.id,
      p.id_users,
      u.nama_lengkap AS nama_user,
      p.id_ruangan,
      r.nama_ruangan,
      g.nama_gedung,
      p.status_peminjaman,
      p.nama_kegiatan,
      p.waktu_peminjaman_mulai,
      p.waktu_peminjaman_selesai,
      p.surat_peminjaman,
      p.created_at,
      p.updated_at,
      (
        SELECT rp.catatan
        FROM tb_riwayat_peminjaman rp
        WHERE rp.id_peminjaman = p.id
        ORDER BY rp.updated_at DESC
        LIMIT 1
      ) AS catatan
    FROM tb_peminjaman p
    LEFT JOIN tb_users u ON p.id_users = u.id
    LEFT JOIN tb_ruangan r ON p.id_ruangan = r.id
    LEFT JOIN tb_gedung g ON r.id_gedung = g.id
    ORDER BY p.id ASC
  `);

  return rows;
}

// ============================
// GET BY ID
// ============================

export async function getPeminjamanById(id: number) {
  // Cek auto expired
  const [cek]: any = await pool.query(`
    SELECT id FROM tb_peminjaman
    WHERE id = ?
      AND status_peminjaman = 'menunggu persetujuan'
      AND waktu_peminjaman_mulai IS NOT NULL
      AND NOW() > DATE_ADD(waktu_peminjaman_mulai, INTERVAL 1 DAY)
  `, [id]);

  if (cek.length > 0) {
    await pool.query(
      `UPDATE tb_peminjaman SET status_peminjaman = 'expired' WHERE id = ?`,
      [id]
    );
    await pool.query(
      `INSERT INTO tb_riwayat_peminjaman (id_peminjaman, catatan)
       VALUES (?, ?)`,
      [id, "expired karena tidak dikonfirmasi admin"]
    );
  }

  const [rows]: any = await pool.query(
    `SELECT * FROM tb_peminjaman WHERE id = ?`,
    [id]
  );
  return rows[0];
}

// ============================
// DROPDOWNS
// ============================

export async function getAllUsers() {
  const [rows] = await pool.query(`
    SELECT id, nama_lengkap
    FROM tb_users
    WHERE is_active = 1
    ORDER BY nama_lengkap ASC
  `);
  return rows;
}

export async function getAllRuangan() {
  const [rows] = await pool.query(`
    SELECT r.id, r.nama_ruangan, g.nama_gedung
    FROM tb_ruangan r
    LEFT JOIN tb_gedung g ON r.id_gedung = g.id
    WHERE r.status_ruangan = 'tersedia'
    ORDER BY r.nama_ruangan ASC
  `);
  return rows;
}

// ============================
// CREATE
// ============================

export async function createPeminjaman(data: any) {
  let {
    id_users,
    id_ruangan,
    status_peminjaman = "menunggu persetujuan",
    nama_kegiatan = null,
    waktu_peminjaman_mulai = null,
    waktu_peminjaman_selesai = null,
    surat_peminjaman = null,
  } = data;

  // Auto expired jika tanggal mulai sudah lewat
  if (waktu_peminjaman_mulai && new Date(waktu_peminjaman_mulai) < new Date()) {
    status_peminjaman = "expired";
  }

  // Validasi bentrok jadwal
  const [cekBentrok]: any = await pool.query(`
    SELECT id FROM tb_peminjaman
    WHERE id_ruangan = ?
      AND status_peminjaman NOT IN ('selesai', 'dibatalkan', 'expired')
      AND waktu_peminjaman_mulai <= ?
      AND waktu_peminjaman_selesai >= ?
  `, [id_ruangan, waktu_peminjaman_selesai, waktu_peminjaman_mulai]);

  if (cekBentrok.length > 0) throw new Error("Ruangan sudah dipinjam pada waktu tersebut.");

  const [result]: any = await pool.query(`
    INSERT INTO tb_peminjaman
      (id_users, id_ruangan, status_peminjaman, nama_kegiatan, waktu_peminjaman_mulai, waktu_peminjaman_selesai, surat_peminjaman)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [id_users || null, id_ruangan || null, status_peminjaman, nama_kegiatan, waktu_peminjaman_mulai, waktu_peminjaman_selesai, surat_peminjaman]);

  const insertId = result.insertId;

  // Kirim email notifikasi untuk peminjaman baru
  try {
    const peminjamanDetail = await getPeminjamanDetailById(insertId);
    if (peminjamanDetail && peminjamanDetail.email) {
      await sendStatusUpdateEmail(
        peminjamanDetail.email,
        peminjamanDetail.nama_lengkap,
        status_peminjaman,
        peminjamanDetail
      );
    }
  } catch (emailError) {
    console.error("Gagal mengirim email notifikasi:", emailError);
    // Jangan gagalkan proses create hanya karena email gagal terkirim
  }


  // Tambahkan riwayat otomatis jika expired
  if (status_peminjaman === "expired") {
    await pool.query(
      `INSERT INTO tb_riwayat_peminjaman (id_peminjaman, catatan)
       VALUES (?, ?)`,
      [insertId, "expired karena tanggal mulai sudah lewat saat input"]
    );
  }

  // Tambahkan riwayat default jika selesai
  if (status_peminjaman === "selesai") {
    await pool.query(
      `INSERT INTO tb_riwayat_peminjaman (id_peminjaman, catatan)
       VALUES (?, ?)`,
      [insertId, "tidak ada catatan"]
    );
  }

  return insertId;
}

// ============================
// UPDATE
// ============================

export async function updatePeminjaman(id: number, data: any) {
  // Dapatkan status lama sebelum update
  const [currentData]: any = await pool.query(
    `SELECT status_peminjaman FROM tb_peminjaman WHERE id = ?`,
    [id]
  );
  const oldStatus = currentData[0]?.status_peminjaman;
  
  let {
    id_users,
    id_ruangan,
    status_peminjaman = "menunggu persetujuan",
    nama_kegiatan = null,
    waktu_peminjaman_mulai = null,
    waktu_peminjaman_selesai = null,
    surat_peminjaman = null,
  } = data;

  // Auto expired jika update ke tanggal lampau
  if (waktu_peminjaman_mulai && new Date(waktu_peminjaman_mulai) < new Date()) {
    status_peminjaman = "expired";
  }

  // Validasi bentrok jadwal
  const [cekBentrok]: any = await pool.query(`
    SELECT id FROM tb_peminjaman
    WHERE id_ruangan = ?
      AND status_peminjaman NOT IN ('selesai', 'dibatalkan', 'expired')
      AND waktu_peminjaman_mulai <= ?
      AND waktu_peminjaman_selesai >= ?
      AND id <> ?
  `, [id_ruangan, waktu_peminjaman_selesai, waktu_peminjaman_mulai, id]);

  if (cekBentrok.length > 0) throw new Error("Ruangan sudah dipinjam pada waktu tersebut.");

  await pool.query(`
    UPDATE tb_peminjaman SET
      id_users = ?, id_ruangan = ?, status_peminjaman = ?, nama_kegiatan = ?,
      waktu_peminjaman_mulai = ?, waktu_peminjaman_selesai = ?, surat_peminjaman = ?
    WHERE id = ?
  `, [id_users || null, id_ruangan || null, status_peminjaman, nama_kegiatan, waktu_peminjaman_mulai, waktu_peminjaman_selesai, surat_peminjaman, id]);

  // Kirim email jika status berubah
  if (oldStatus !== status_peminjaman) {
    try {
      const peminjamanDetail = await getPeminjamanDetailById(id);
      if (peminjamanDetail && peminjamanDetail.email) {
        await sendStatusUpdateEmail(
          peminjamanDetail.email,
          peminjamanDetail.nama_lengkap,
          status_peminjaman,
          peminjamanDetail
        );
      }
    } catch (emailError) {
      console.error("Gagal mengirim email notifikasi:", emailError);
      // Jangan gagalkan update hanya karena email gagal terkirim
    }
  }

  // Riwayat otomatis jika expired
  if (status_peminjaman === "expired") {
    await pool.query(
      `INSERT INTO tb_riwayat_peminjaman (id_peminjaman, catatan)
       VALUES (?, ?)`,
      [id, "expired karena tanggal mulai sudah lewat saat update"]
    );
  }

  // Riwayat default jika selesai
  if (status_peminjaman === "selesai") {
    await pool.query(
      `INSERT INTO tb_riwayat_peminjaman (id_peminjaman, catatan)
       VALUES (?, ?)`,
      [id, "tidak ada catatan"]
    );
  }
}

// ============================
// DELETE
// ============================

export async function deletePeminjaman(id: number) {
  await pool.query(`DELETE FROM tb_peminjaman WHERE id = ?`, [id]);
}



// Tambahkan fungsi untuk mendapatkan data lengkap peminjaman
export async function getPeminjamanDetailById(id: number) {
  const [rows]: any = await pool.query(`
    SELECT 
      p.*,
      u.nama_lengkap,
      u.email,
      r.nama_ruangan,
      g.nama_gedung
    FROM tb_peminjaman p
    LEFT JOIN tb_users u ON p.id_users = u.id
    LEFT JOIN tb_ruangan r ON p.id_ruangan = r.id
    LEFT JOIN tb_gedung g ON r.id_gedung = g.id
    WHERE p.id = ?
  `, [id]);
  
  return rows[0];
}