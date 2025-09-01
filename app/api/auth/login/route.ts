// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { login } from "@/controllers/authController";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const result = await login(email, password);

    if (!result.token  || !result.user) {
      return NextResponse.json({ error: "Login gagal" }, { status: 401 });
    }

    const res = NextResponse.json
      ({ success: true,
        ...result.user,   // id, email, username, dll
        token: result.token
       });

    // app/api/auth/login/route.ts
    res.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari dalam detik
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tambahkan ini
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

