//app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { register } from "@/controllers/authController";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // pastikan role_id dan id_pengenal dikirim
    if (!body.id_pengenal || !body.requested_role_id) {
      return NextResponse.json({ error: "ID Pengenal dan Role wajib diisi" }, { status: 400 });
    }

    const result = await register(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


// import { NextResponse } from "next/server";
// import { register } from "@/controllers/authController";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const result = await register(body);
//     return NextResponse.json(result, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }
