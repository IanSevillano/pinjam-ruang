// app/api/gedung/[id]/route.ts
import { NextResponse } from "next/server";
import {
  getGedungById,
  updateGedung,
  deleteGedung,
} from "../../../../models/gedungModel";

type RouteContext = {
  params: {
    id: string;
  };
};

// GET /api/gedung/[id]
export async function GET(_req: Request, context: RouteContext) {
  const id = Number(context.params.id);
  const gedung = await getGedungById(id);

  if (!gedung) {
    return NextResponse.json({ message: "Gedung tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(gedung);
}

// PUT /api/gedung/[id]
export async function PUT(req: Request, context: RouteContext) {
  const id = Number(context.params.id);
  const data = await req.json();

  await updateGedung(id, data);
  return NextResponse.json({ message: "Gedung berhasil diupdate" });
}

// DELETE /api/gedung/[id]
export async function DELETE(_req: Request, context: RouteContext) {
  const id = Number(context.params.id);

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
