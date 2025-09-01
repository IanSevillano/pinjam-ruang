// app/api/roles/[id]/route.ts
import { NextResponse } from "next/server";
import { getRoleByIdController, editRole, removeRole } from "@/controllers/rolesController";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const role = await getRoleByIdController(Number(params.id));
    if (!role) {
      return NextResponse.json({ success: false, message: "Role tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: role });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    await editRole(Number(params.id), body);
    return NextResponse.json({ success: true, message: "Role berhasil diupdate" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await removeRole(Number(params.id));
    return NextResponse.json({ success: true, message: "Role berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}