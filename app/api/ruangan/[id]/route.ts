//app/api/ruangan/[id]/route.ts
import { NextResponse } from 'next/server';
import {
  getRuanganById,
  updateRuangan,
  deleteRuangan
} from '../../../../models/ruanganModel';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await getRuanganById(Number(params.id));
  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  await updateRuangan(Number(params.id), body);
  return NextResponse.json({ message: 'Data updated' });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await deleteRuangan(Number(params.id));
  return NextResponse.json({ message: 'Data deleted' });
}
