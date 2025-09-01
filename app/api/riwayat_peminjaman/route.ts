// app/api/riwayat_peminjaman/route.ts
import { NextResponse } from "next/server";
import {
  getAllRiwayatPeminjaman,
  createRiwayatPeminjaman,
  updateRiwayatPeminjaman,
  deleteRiwayatPeminjaman,
} from "../../../models/riwayatPeminjamanModel";

export async function GET() {
  const riwayat = await getAllRiwayatPeminjaman();
  return NextResponse.json(riwayat);
}

export async function POST(request: Request) {
  const data = await request.json();
  const id = await createRiwayatPeminjaman(data);
  return NextResponse.json({ id }, { status: 201 });
}

