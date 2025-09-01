// app/api/peminjaman/saya/route.ts
// app/api/peminjaman/saya/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import pool from "@/lib/db";

// ============================
// GET: Ambil peminjaman user + auto expired
// ============================
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token) as { id: number };
    const userId = payload.id;

    const [rows]: any = await pool.query(`
      SELECT
        p.id,
        p.id_users,
        r.nama_ruangan AS ruangan,
        g.nama_gedung AS gedung,
        p.nama_kegiatan,
        p.waktu_peminjaman_mulai,
        p.waktu_peminjaman_selesai,
        p.surat_peminjaman,
        p.status_peminjaman,
        (
          SELECT rp.catatan
          FROM tb_riwayat_peminjaman rp
          WHERE rp.id_peminjaman = p.id
          ORDER BY rp.updated_at DESC
          LIMIT 1
        ) AS catatan
      FROM tb_peminjaman p
      LEFT JOIN tb_ruangan r ON p.id_ruangan = r.id
      LEFT JOIN tb_gedung g ON r.id_gedung = g.id
      WHERE p.id_users = ?
      ORDER BY p.id desc
    `, [userId]);

    // Auto expired: peminjaman menunggu persetujuan yang sudah lewat
    const now = new Date();
    for (const pem of rows) {
      if (
        pem.status_peminjaman === "menunggu persetujuan" &&
        pem.waktu_peminjaman_mulai &&
        new Date(pem.waktu_peminjaman_mulai) < now
      ) {
        await pool.query(
          `UPDATE tb_peminjaman SET status_peminjaman = 'expired' WHERE id = ?`,
          [pem.id]
        );
        await pool.query(
          `INSERT INTO tb_riwayat_peminjaman (id_peminjaman, catatan) VALUES (?, ?)` ,
          [pem.id, "expired karena tidak dikonfirmasi admin"]
        );
        pem.status_peminjaman = "expired";
        pem.catatan = "expired karena tidak dikonfirmasi admin";
      }
    }

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ============================
// POST: Ajukan peminjaman baru
// ============================
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token) as { id: number };
    const userId = payload.id;

    const body = await req.json();
    const { id_ruangan, nama_kegiatan, waktu_peminjaman_mulai, waktu_peminjaman_selesai, surat_peminjaman } = body;

    // ❌ Validasi: tidak boleh booking hari ini atau ke belakang
    const mulai = new Date(waktu_peminjaman_mulai);
    const now = new Date();
    const besok = new Date();
    besok.setHours(0, 0, 0, 0);
    besok.setDate(besok.getDate() + 1);
    if (mulai < besok) {
      return NextResponse.json({ error: "Tanggal mulai minimal besok, tidak bisa hari ini atau ke belakang." }, { status: 400 });
    }

    // Cek bentrok
    const [cekBentrok]: any = await pool.query(`
      SELECT id FROM tb_peminjaman
      WHERE id_ruangan = ? 
        AND status_peminjaman NOT IN ('selesai', 'dibatalkan', 'expired')
        AND waktu_peminjaman_mulai <= ?
        AND waktu_peminjaman_selesai >= ?
    `, [id_ruangan, waktu_peminjaman_selesai, waktu_peminjaman_mulai]);

    if (cekBentrok.length > 0) return NextResponse.json({ error: "Ruangan sudah dipinjam pada waktu tersebut." }, { status: 400 });

    const [result]: any = await pool.query(`
      INSERT INTO tb_peminjaman (id_users, id_ruangan, status_peminjaman, nama_kegiatan, waktu_peminjaman_mulai, waktu_peminjaman_selesai, surat_peminjaman)
      VALUES (?, ?, 'menunggu persetujuan', ?, ?, ?, ?)
    `, [userId, id_ruangan, nama_kegiatan, waktu_peminjaman_mulai, waktu_peminjaman_selesai, surat_peminjaman]);

    const [rows]: any = await pool.query(`
      SELECT
        p.id,
        p.id_users,
        r.nama_ruangan AS ruangan,
        g.nama_gedung AS gedung,
        p.nama_kegiatan,
        p.waktu_peminjaman_mulai,
        p.waktu_peminjaman_selesai,
        p.surat_peminjaman,
        p.status_peminjaman
      FROM tb_peminjaman p
      LEFT JOIN tb_ruangan r ON p.id_ruangan = r.id
      LEFT JOIN tb_gedung g ON r.id_gedung = g.id
      WHERE p.id = ?
    `, [result.insertId]);

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ============================
// PUT: Update peminjaman (H-2) + validasi tanggal
// ============================
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token) as { id: number };
    const userId = payload.id;

    const body = await req.json();
    const { id, id_ruangan, nama_kegiatan, waktu_peminjaman_mulai, waktu_peminjaman_selesai, surat_peminjaman } = body;

    // ❌ Validasi: tidak boleh booking hari ini atau ke belakang
    const mulai = new Date(waktu_peminjaman_mulai);
    const besok = new Date();
    besok.setHours(0, 0, 0, 0);
    besok.setDate(besok.getDate() + 1);
    if (mulai < besok) {
      return NextResponse.json({ error: "Tanggal mulai minimal besok, tidak bisa hari ini atau ke belakang." }, { status: 400 });
    }

    // ❌ Cek H-2
    const now = new Date();
    const duaHariSebelum = new Date(waktu_peminjaman_mulai);
    duaHariSebelum.setDate(duaHariSebelum.getDate() - 2);
    if (now > duaHariSebelum) return NextResponse.json({ error: "Tidak bisa edit, H-2 sebelum acara" }, { status: 400 });

    await pool.query(`
      UPDATE tb_peminjaman
      SET id_ruangan = ?, nama_kegiatan = ?, waktu_peminjaman_mulai = ?, waktu_peminjaman_selesai = ?, surat_peminjaman = ?, status_peminjaman = 'menunggu persetujuan'
      WHERE id = ? AND id_users = ?
    `, [id_ruangan, nama_kegiatan, waktu_peminjaman_mulai, waktu_peminjaman_selesai, surat_peminjaman, id, userId]);

    const [rows]: any = await pool.query(`
      SELECT
        p.id,
        p.id_users,
        r.nama_ruangan AS ruangan,
        g.nama_gedung AS gedung,
        p.nama_kegiatan,
        p.waktu_peminjaman_mulai,
        p.waktu_peminjaman_selesai,
        p.surat_peminjaman,
        p.status_peminjaman
      FROM tb_peminjaman p
      LEFT JOIN tb_ruangan r ON p.id_ruangan = r.id
      LEFT JOIN tb_gedung g ON r.id_gedung = g.id
      WHERE p.id = ?
    `, [id]);

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
