// app/api/gedung/[id]/route.ts
import { NextResponse } from "next/server";
import {
  getGedungById,
  updateGedung,
  deleteGedung,
} from "../../../../models/gedungModel";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  const id = Number(params.id);
  const gedung = await getGedungById(id);

  if (!gedung) {
    return NextResponse.json({ message: "Gedung tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(gedung);
}

export async function PUT(request: Request, { params }: Params) {
  const id = Number(params.id);
  const data = await request.json();

  await updateGedung(id, data);
  return NextResponse.json({ message: "Gedung berhasil diupdate" });
}

export async function DELETE(request: Request, { params }: Params) {
  const id = Number(params.id);

  await deleteGedung(id);
  return NextResponse.json({ message: "Gedung berhasil dihapus" });
}


// // app/api/gedung/[id]/route.ts
// import { NextResponse } from "next/server";
// import { getGedungById, updateGedung, deleteGedung } from "../../../../models/gedungModel";

// export async function GET(_: Request, { params }: { params: { id: string } }) {
//   const gedung = await getGedungById(Number(params.id));
//   if (!gedung) return NextResponse.json({ message: "Not found" }, { status: 404 });
//   return NextResponse.json(gedung);
// }

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const data = await request.json();
//   await updateGedung(Number(params.id), data);
//   return NextResponse.json({ message: "Updated" });
// }

// export async function DELETE(_: Request, { params }: { params: { id: string } }) {
//   await deleteGedung(Number(params.id));
//   return NextResponse.json({ message: "Deleted" });
// }
