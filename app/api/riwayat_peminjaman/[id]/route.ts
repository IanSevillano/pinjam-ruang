// app/api/riwayat_peminjaman/[id]/route.ts
import { NextResponse } from "next/server";
import {
  updateRiwayatPeminjaman,
  deleteRiwayatPeminjaman,
  getRiwayatPeminjamanById,
} from "../../../../models/riwayatPeminjamanModel";

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  const id = Number(params.id);
  const data = await request.json();
  await updateRiwayatPeminjaman(id, data);
  return NextResponse.json({ message: "Riwayat Peminjaman berhasil diupdate" });
}

export async function DELETE(request: Request, { params }: Params) {
  const id = Number(params.id);
  await deleteRiwayatPeminjaman(id);
  return NextResponse.json({ message: "Riwayat Peminjaman berhasil dihapus" });
}

export async function GET(request: Request, { params }: Params) {
  const id = Number(params.id);
  const riwayat = await getRiwayatPeminjamanById(id);
  if (!riwayat)
    return NextResponse.json({ message: "Riwayat Peminjaman tidak ditemukan" }, { status: 404 });
  return NextResponse.json(riwayat);
}
