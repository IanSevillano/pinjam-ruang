// app/api/ruangan/[id]/route.ts
import { NextResponse } from "next/server";
import {
  getRuanganById,
  updateRuangan,
  deleteRuangan,
} from "@/models/ruanganModel";

// GET /api/ruangan/[id]
export async function GET(_req: Request, { params }: any) {
  try {
    const id = Number(params?.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const data: any = await getRuanganById(id);
    if (!data) {
      return NextResponse.json({ success: false, message: "Ruangan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Terjadi kesalahan" }, { status: 500 });
  }
}

// PUT /api/ruangan/[id]
export async function PUT(req: Request, { params }: any) {
  try {
    const id = Number(params?.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const body: any = await req.json();
    const updated: any = await updateRuangan(id, body);

    return NextResponse.json(
      { success: true, message: "Data ruangan berhasil diupdate", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Terjadi kesalahan" }, { status: 500 });
  }
}

// DELETE /api/ruangan/[id]
export async function DELETE(_req: Request, { params }: any) {
  try {
    const id = Number(params?.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const deleted: any = await deleteRuangan(id);

    return NextResponse.json(
      { success: true, message: "Data ruangan berhasil dihapus", data: deleted },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Terjadi kesalahan" }, { status: 500 });
  }
}
// //app/api/ruangan/[id]/route.ts
// import { NextResponse } from 'next/server';
// import {
//   getRuanganById,
//   updateRuangan,
//   deleteRuangan
// } from '../../../../models/ruanganModel';

// export async function GET(_: Request, { params }: { params: { id: string } }) {
//   const data = await getRuanganById(Number(params.id));
//   return NextResponse.json(data);
// }

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const body = await request.json();
//   await updateRuangan(Number(params.id), body);
//   return NextResponse.json({ message: 'Data updated' });
// }

// export async function DELETE(_: Request, { params }: { params: { id: string } }) {
//   await deleteRuangan(Number(params.id));
//   return NextResponse.json({ message: 'Data deleted' });
// }
