// app/api/gedung/route.ts
import { NextResponse } from "next/server";
import { createGedung, getAllGedung } from "../../../models/gedungModel";

export async function GET() {
  const gedung = await getAllGedung();
  return NextResponse.json(gedung);
}

export async function POST(request: Request) {
  const data = await request.json();
  const id = await createGedung(data);
  return NextResponse.json({ id }, { status: 201 });
}
