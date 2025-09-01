//app/api/ruangan/route.ts

import { NextResponse } from 'next/server';
import {
  getAllRuangan,
  createRuangan
} from '../../../models/ruanganModel';

export async function GET() {
  const data = await getAllRuangan();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const insertId = await createRuangan(body);
  return NextResponse.json({ id: insertId }, { status: 201 });
}
