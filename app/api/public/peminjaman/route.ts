
//app/api/public/peminjaman/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
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
      ORDER BY p.waktu_peminjaman_mulai asc
    `);
    
    return NextResponse.json({ peminjaman: rows });
  } catch (err: any) {
    console.error("Error fetching public peminjaman:", err);
    return NextResponse.json(
      { error: "Failed to fetch peminjaman data" },
      { status: 500 }
    );
  }
}