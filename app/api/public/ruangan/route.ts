
//app/api/public/ruangan/route.ts
// app/api/public/ruangan/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.id,
        r.nama_ruangan,
        r.status_ruangan,
        r.kapasitas,
        r.fasilitas,
        g.kode_gedung,
        g.nama_gedung,
        r.id_gedung
      FROM tb_ruangan r
      LEFT JOIN tb_gedung g ON r.id_gedung = g.id
      ORDER BY r.id ASC
    `);

    return NextResponse.json({ ruangan: rows });
  } catch (err: any) {
    console.error("Error fetching public ruangan:", err);
    return NextResponse.json(
      { error: "Failed to fetch ruangan data" },
      { status: 500 }
    );
  }
}
