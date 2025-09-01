//app/api/auth/forgot-password/route.tsx
    
import { NextResponse } from 'next/server';
import { requestPasswordReset, verifyResetCode, changePassword } from '@/controllers/passwordController';

export async function POST(request: Request) {
  try {
    const { email, code, password, action } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email diperlukan' }, { status: 400 });
    }

    switch (action) {
      case 'request-code':
        return NextResponse.json(await requestPasswordReset(email));

      case 'verify-code':
        if (!code) return NextResponse.json({ error: 'Kode diperlukan' }, { status: 400 });
        return NextResponse.json(await verifyResetCode(email, code));

      case 'change-password':
        if (!code || !password) {
          return NextResponse.json({ error: 'Kode & password baru diperlukan' }, { status: 400 });
        }
        return NextResponse.json(await changePassword(email, code, password));

      default:
        return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan' }, { status: 500 });
  }
}
