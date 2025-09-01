// app/api/users/activate/route.ts

import { activateUser, activateUserById } from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { id } = await request.json();
  await activateUserById(id);
  return NextResponse.json({ message: 'User activated successfully' });
}



