// app/api/riwayat_peminjaman/[id]/route.ts
import { NextResponse } from "next/server";
import {
  updateRiwayatPeminjaman,
  deleteRiwayatPeminjaman,
  getRiwayatPeminjamanById,
} from "../../../../models/riwayatPeminjamanModel";

// ============================
// UPDATE
// ============================
export async function PUT(request: Request, { params }: any) {
  try {
    const { id } = params;
    const riwayatId = Number(id);

    if (isNaN(riwayatId)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const data = await request.json();
    await updateRiwayatPeminjaman(riwayatId, data);

    return NextResponse.json({ success: true, message: "Riwayat Peminjaman berhasil diupdate" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ============================
// DELETE
// ============================
export async function DELETE(request: Request, { params }: any) {
  try {
    const { id } = params;
    const riwayatId = Number(id);

    if (isNaN(riwayatId)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    await deleteRiwayatPeminjaman(riwayatId);
    return NextResponse.json({ success: true, message: "Riwayat Peminjaman berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ============================
// GET BY ID
// ============================
export async function GET(request: Request, { params }: any) {
  try {
    const { id } = params;
    const riwayatId = Number(id);

    if (isNaN(riwayatId)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const riwayat = await getRiwayatPeminjamanById(riwayatId);
    if (!riwayat) {
      return NextResponse.json(
        { success: false, message: "Riwayat Peminjaman tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, riwayat });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// // app/api/riwayat_peminjaman/[id]/route.ts
// import { NextResponse } from "next/server";
// import {
//   updateRiwayatPeminjaman,
//   deleteRiwayatPeminjaman,
//   getRiwayatPeminjamanById,
// } from "../../../../models/riwayatPeminjamanModel";

// interface Params {
//   params: { id: string };
// }

// export async function PUT(request: Request, { params }: Params) {
//   const id = Number(params.id);
//   const data = await request.json();
//   await updateRiwayatPeminjaman(id, data);
//   return NextResponse.json({ message: "Riwayat Peminjaman berhasil diupdate" });
// }

// export async function DELETE(request: Request, { params }: Params) {
//   const id = Number(params.id);
//   await deleteRiwayatPeminjaman(id);
//   return NextResponse.json({ message: "Riwayat Peminjaman berhasil dihapus" });
// }

// export async function GET(request: Request, { params }: Params) {
//   const id = Number(params.id);
//   const riwayat = await getRiwayatPeminjamanById(id);
//   if (!riwayat)
//     return NextResponse.json({ message: "Riwayat Peminjaman tidak ditemukan" }, { status: 404 });
//   return NextResponse.json(riwayat);
// }
