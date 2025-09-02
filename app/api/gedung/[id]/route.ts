// app/api/gedung/[id]/route.ts
// app/api/gedung/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getGedungById, updateGedung, deleteGedung } from "@/models/gedungModel";

// GET /api/gedung/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const gedung = await getGedungById(Number(params.id));

    if (!gedung) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(gedung, { status: 200 });
  } catch (error) {
    console.error("GET /gedung/[id] error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/gedung/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    await updateGedung(Number(params.id), data);

    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (error) {
    console.error("PUT /gedung/[id] error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/gedung/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteGedung(Number(params.id));
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /gedung/[id] error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
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
