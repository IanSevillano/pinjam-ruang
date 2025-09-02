// app/api/roles/[id]/route.ts
import { NextResponse } from "next/server";
import { getRoleByIdController, editRole, removeRole } from "@/controllers/rolesController";

// GET /api/roles/[id]
export async function GET(_req: Request, { params }: any) {
  try {
    const id = Number(params?.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const role: any = await getRoleByIdController(id);
    if (!role) {
      return NextResponse.json({ success: false, message: "Role tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: role }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Terjadi kesalahan" }, { status: 500 });
  }
}

// PUT /api/roles/[id]
export async function PUT(req: Request, { params }: any) {
  try {
    const id = Number(params?.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const body: any = await req.json();
    const updated: any = await editRole(id, body); // kembalian bebas (any)

    if (!updated) {
      return NextResponse.json({ success: false, message: "Role tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Role berhasil diupdate", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Terjadi kesalahan" }, { status: 500 });
  }
}

// DELETE /api/roles/[id]
export async function DELETE(_req: Request, { params }: any) {
  try {
    const id = Number(params?.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID tidak valid" }, { status: 400 });
    }

    const deleted: any = await removeRole(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Role tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Role berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Terjadi kesalahan" }, { status: 500 });
  }
}

// // app/api/roles/[id]/route.ts
// import { NextResponse } from "next/server";
// import { getRoleByIdController, editRole, removeRole } from "@/controllers/rolesController";

// export async function GET(_: Request, { params }: { params: { id: string } }) {
//   try {
//     const role = await getRoleByIdController(Number(params.id));
//     if (!role) {
//       return NextResponse.json({ success: false, message: "Role tidak ditemukan" }, { status: 404 });
//     }
//     return NextResponse.json({ success: true, data: role });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, message: err.message }, { status: 500 });
//   }
// }

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const body = await request.json();
//     await editRole(Number(params.id), body);
//     return NextResponse.json({ success: true, message: "Role berhasil diupdate" });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, message: err.message }, { status: 400 });
//   }
// }

// export async function DELETE(_: Request, { params }: { params: { id: string } }) {
//   try {
//     await removeRole(Number(params.id));
//     return NextResponse.json({ success: true, message: "Role berhasil dihapus" });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, message: err.message }, { status: 500 });
//   }
// }