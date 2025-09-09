import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    // Gunakan pengecekan tipe yang lebih eksplisit untuk memastikan file ada
    const file = formData.get('surat_peminjaman');

    // Tambahkan validasi tipe di sini
    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: 'Request tidak berisi file yang valid.' },
        { status: 400 }
      );
    }
    
    // Konversikan file ke bentuk Blob untuk pengunggahan
    const fileBlob = file as Blob;
    const existingFileUrl = formData.get('existing_file') as string | null;

    // Validasi tipe file (hanya PDF)
    if (fileBlob.type !== 'application/pdf') {
      return NextResponse.json(
        { message: 'Hanya file PDF yang diizinkan.' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (maksimal 4MB untuk menghindari batas payload Vercel)
    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
    if (fileBlob.size > MAX_FILE_SIZE) {
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
        console.error('Gagal menghapus file lama:', delError);
      }
    }

    // Generate nama file unik
    const uniqueFilename = `surat-${Date.now()}-${(file as File).name.replace(/\s+/g, '-')}`;

    // Unggah file baru ke Vercel Blob
    const blob = await put(uniqueFilename, fileBlob, {
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
