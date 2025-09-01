//app/api/users/approve/route.ts

// app/api/users/approve/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: "ID user wajib" }, { status: 400 });

    // ambil user
    const [users] = await db.query<any[]>(
      "SELECT * FROM tb_users WHERE id = ?",
      [id]
    );
    if (users.length === 0) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const user = users[0];

    if (!user.requested_role_id) {
      return NextResponse.json({ error: "User tidak mengajukan role" }, { status: 400 });
    }

    // aktifkan akun
    await db.query<ResultSetHeader>(
      "UPDATE tb_users SET is_active = 1, requested_role_id = NULL WHERE id = ?",
      [id]
    );

    // tambahkan role ke tb_hak_akses
    await db.query<ResultSetHeader>(
      "INSERT INTO tb_hak_akses (id_user, id_roles) VALUES (?, ?)",
      [id, user.requested_role_id]
    );

    // ✅ Kirim email verifikasi
    if (user.token_verifikasi) {
      await sendVerificationEmail(user.email, user.token_verifikasi);
    }

    return NextResponse.json({ message: "User berhasil di-approve & email verifikasi dikirim" });
  } catch (error: any) {
    console.error("Error approving user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
