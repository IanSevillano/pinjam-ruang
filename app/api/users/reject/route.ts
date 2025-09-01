//app/api/users/reject/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: "ID user wajib" }, { status: 400 });

    // hapus user (kalau mau soft delete bisa ganti ke update is_active=0, is_verified=0)
    await db.query<ResultSetHeader>(
      "DELETE FROM tb_users WHERE id = ?",
      [id]
    );

    return NextResponse.json({ message: "User berhasil ditolak & dihapus" });
  } catch (error: any) {
    console.error("Error rejecting user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
