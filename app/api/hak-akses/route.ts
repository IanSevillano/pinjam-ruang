// app/api/hak-akses/route.ts
import { NextResponse } from "next/server";
import { fetchAllHakAkses, createHakAksesData } from "@/controllers/hakAksesController";

export async function GET(req: Request) {
  try {
    const res = await fetchAllHakAkses(req as any, {
      status: (code: number) => ({
        json: (data: any) => NextResponse.json(data, { status: code }),
      }),
    } as any);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await createHakAksesData(
      { body } as any,
      {
        status: (code: number) => ({
          json: (data: any) => NextResponse.json(data, { status: code }),
        }),
      } as any
    );
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
