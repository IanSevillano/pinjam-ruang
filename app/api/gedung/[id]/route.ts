// app/api/gedung/[id]/route.ts
import { NextResponse } from "next/server";
import { getGedungById, updateGedung, deleteGedung } from "@/models/gedungModel";

// Tipe untuk context
type Context = {
  params: {
    id: string;
  };
};

// ============================
// GET BY ID
// ============================
export async function GET(_req: Request, context: Context) {
  try {
    const gedungId = Number(context.params.id);

    if (isNaN(gedungId)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const gedung = await getGedungById(gedungId);
    if (!gedung) {
      return NextResponse.json(
        { success: false, message: "Gedung tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, gedung });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ============================
// UPDATE
// ============================
export async function PUT(req: Request, context: Context) {
  try {
    const gedungId = Number(context.params.id);

    if (isNaN(gedungId)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const body = await req.json();
    await updateGedung(gedungId, body);

    return NextResponse.json({ success: true, id: gedungId });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}

// ============================
// DELETE
// ============================
export async function DELETE(_req: Request, context: Context) {
  try {
    const gedungId = Number(context.params.id);

    if (isNaN(gedungId)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    await deleteGedung(gedungId);
    return NextResponse.json({ success: true, id: gedungId });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
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
