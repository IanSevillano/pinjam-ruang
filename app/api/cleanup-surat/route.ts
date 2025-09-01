//app/api/cleanup-surat/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import pool from "@/lib/db"; // sesuaikan path db

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/surat-peminjaman");

export async function DELETE() {
  try {
    // 1. Ambil semua file di folder
    const files = fs.readdirSync(UPLOAD_DIR);

    // 2. Ambil semua file yang terpakai di DB
    const [rows]: any = await pool.query(
      "SELECT surat_peminjaman FROM tb_peminjaman WHERE surat_peminjaman IS NOT NULL"
    );
    const usedFiles: string[] = rows.map((r: any) =>
      path.basename(r.surat_peminjaman)
    );

    // 3. Cari file yang tidak ada di DB
    const deleted: string[] = [];

    files.forEach((file: string) => {
      if (!usedFiles.includes(file)) {
        fs.unlinkSync(path.join(UPLOAD_DIR, file));
        deleted.push(file);
      }
    });

    return NextResponse.json({
      success: true,
      message: "Cleanup selesai",
      deletedCount: deleted.length,
      deleted,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
