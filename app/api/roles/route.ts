// app/api/roles/route.ts
import { NextResponse } from "next/server";
import { listRoles, addRole } from "@/controllers/rolesController";

export async function GET() {
  try {
    const roles = await listRoles();
    return NextResponse.json(roles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newRole = await addRole(body);
    return NextResponse.json(newRole);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}