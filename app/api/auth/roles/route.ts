//app/api/auth/roles/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Ambil token dari header Authorization atau cookie
    const cookieToken = req.cookies.get("token")?.value;
    const headerToken = req.headers.get("authorization")?.split(" ")[1];
    const token = headerToken || cookieToken;

    if (!token) {
      return NextResponse.json({ error: "Token tidak ditemukan" }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded?.id) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    // Ambil role user dari database
    const [roles] = await db.query(
      `
      SELECT r.id, r.nama_role
      FROM tb_hak_akses ha
      JOIN tb_roles r ON ha.id_roles = r.id
      WHERE ha.id_user = ?
      `,
      [decoded.id]
    );

    return NextResponse.json({ roles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



