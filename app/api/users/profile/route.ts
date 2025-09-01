// app/api/users/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getUserById, updateUser } from "@/models/userModel";

// ✅ Ambil data user yang sedang login
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token) as { id: number, email: string };
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const user = await getUserById(payload.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

// ✅ Update hanya user yang sedang login
// export async function PUT(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const payload = verifyToken(token) as { id: number, email: string };
//   if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

//   const body = await req.json();

//   await updateUser(payload.id, body);

//   return NextResponse.json({ message: "Profil berhasil diperbarui" });
// }

// ✅ Update hanya user yang sedang login


export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token) as { id: number, email: string };
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const body = await req.json();
    await updateUser(payload.id, body);
    return NextResponse.json({ message: "Profil berhasil diperbarui" });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil", details: error.message },
      { status: 500 }
    );
  }
}
