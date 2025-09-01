// // app/api/auth/verify/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { verifyAccount } from "@/controllers/authController";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const token = searchParams.get("token");

//     if (!token) {
//       return NextResponse.json({ error: "Token tidak ditemukan" }, { status: 400 });
//     }

//     await verifyAccount(token);

//     // Redirect ke halaman sukses (misal login page)
//     return NextResponse.redirect(new URL("/login?verified=true", req.url));
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }


// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { verifyAccount } from "@/controllers/authController";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token tidak ditemukan" }, { status: 400 });

  try {
    await verifyAccount(token);
    return NextResponse.redirect(new URL("/login?verified=true", req.url));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const decoded = verifyToken(token);
    return NextResponse.json({ valid: !!decoded, decoded });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
