// app/api/peminjaman/route.ts
import { NextResponse } from "next/server";
import {
  getAllPeminjaman,
  createPeminjaman,
  getAllUsers,
  getAllRuangan,
} from "../../../models/peminjamanModel";

// ============================
// GET
// ============================
export async function GET() {
  try {
    // Auto expired sudah ditangani di getAllPeminjaman()
    const peminjaman = await getAllPeminjaman();
    const users = await getAllUsers();
    const ruangan = await getAllRuangan();

    return NextResponse.json({
      success: true,
      peminjaman,
      users,
      ruangan,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ============================
// POST
// ============================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const insertId = await createPeminjaman(body);

    return NextResponse.json(
      { success: true, id: insertId },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}
