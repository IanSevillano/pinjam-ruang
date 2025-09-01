//app/api/delete-file/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();
    
    if (!filePath) {
      return NextResponse.json(
        { message: 'File path diperlukan' },
        { status: 400 }
      );
    }

    // Validasi bahwa path aman (hanya dalam folder uploads)
    if (!filePath.startsWith('/uploads/surat-peminjaman/')) {
      return NextResponse.json(
        { message: 'Path file tidak valid' },
        { status: 400 }
      );
    }

    const filename = filePath.split('/').pop();
    const fileDir = path.join(process.cwd(), 'public', 'uploads', 'surat-peminjaman');
    const filepath = path.join(fileDir, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return NextResponse.json({
        success: true,
        message: 'File berhasil dihapus'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'File tidak ditemukan' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { message: 'Error deleting file' },
      { status: 500 }
    );
  }
}