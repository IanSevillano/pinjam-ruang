import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('surat_peminjaman') as File | null;
    const existingFileUrl = formData.get('existing_file') as string | null;

    if (!file) {
      return NextResponse.json(
        { message: 'Tidak ada file yang diunggah.' },
        { status: 400 }
      );
    }

    // Validasi tipe file (hanya PDF)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { message: 'Hanya file PDF yang diizinkan.' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (maksimal 4MB untuk menghindari batas payload Vercel)
    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'Ukuran file maksimal 4MB.' },
        { status: 400 }
      );
    }

    // Jika ada file lama, hapus dari Vercel Blob
    if (existingFileUrl) {
      try {
        await del(existingFileUrl);
      } catch (delError) {
        // Gunakan console.error untuk error yang lebih serius
        console.error('Gagal menghapus file lama:', delError);
        // Lanjutkan proses upload meskipun gagal menghapus
      }
    }

    // Generate nama file unik
    const uniqueFilename = `surat-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // Unggah file baru ke Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
    });

    // Kembalikan URL publik dari file yang diunggah
    return NextResponse.json({
      success: 1,
      file: {
        url: blob.url,
      },
    });

  } catch (error) {
    console.error('Terjadi kesalahan saat mengunggah file:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan internal pada server.' },
      { status: 500 }
    );
  }
}
