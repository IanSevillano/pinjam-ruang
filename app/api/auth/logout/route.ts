// // /app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout berhasil" });

  // ✅ Harus sama persis settingnya dengan login
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // langsung expired
  });

  return res;
}

// import { NextResponse } from "next/server";

// export async function POST() {
//   const res = NextResponse.json({ message: "Logout berhasil" });
//   res.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
//   return res;
// }
