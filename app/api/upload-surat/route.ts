//app/api/upload-surat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Buat folder uploads jika belum ada
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'surat-peminjaman');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('surat_peminjaman') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'Tidak ada file yang diupload' },
        { status: 400 }
      );
    }

    // Validasi tipe file (hanya PDF)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { message: 'Hanya file PDF yang diizinkan' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Ukuran file maksimal 4MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate nama file unik
    const timestamp = Date.now();
    const filename = `surat-${timestamp}.pdf`;
    const filepath = path.join(uploadDir, filename);

    // Simpan file
    fs.writeFileSync(filepath, buffer);

    // Kembalikan path relatif
    const relativePath = `/uploads/surat-peminjaman/${filename}`;

    return NextResponse.json({
      success: 1,
      file: {
        url: relativePath
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Error uploading file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(request: NextRequest) {
//   try {
//     // Buat folder uploads jika belum ada
//     const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'surat-peminjaman');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // Get form data
//     const formData = await request.formData();
//     const file = formData.get('surat_peminjaman') as File;
    
//     if (!file) {
//       return NextResponse.json(
//         { message: 'Tidak ada file yang diupload' },
//         { status: 400 }
//       );
//     }

//     // Validasi tipe file (hanya PDF)
//     if (file.type !== 'application/pdf') {
//       return NextResponse.json(
//         { message: 'Hanya file PDF yang diizinkan' },
//         { status: 400 }
//       );
//     }

//     // Validasi ukuran file (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       return NextResponse.json(
//         { message: 'Ukuran file maksimal 5MB' },
//         { status: 400 }
//       );
//     }

//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Generate nama file unik
//     const timestamp = Date.now();
//     const filename = `surat-${timestamp}.pdf`;
//     const filepath = path.join(uploadDir, filename);

//     // Simpan file
//     fs.writeFileSync(filepath, buffer);

//     // Kembalikan path relatif
//     const relativePath = `/uploads/surat-peminjaman/${filename}`;

//     return NextResponse.json({
//       success: 1,
//       file: {
//         url: relativePath
//       }
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { message: 'Error uploading file' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json(
//     { message: 'Method not allowed' },
//     { status: 405 }
//   );
// }
