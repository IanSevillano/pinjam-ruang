// pages/api/upload-surat.ts
import { put, del } from '@vercel/blob';
import { NextApiResponse, NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false, // Penting: nonaktifkan body parser bawaan Next.js
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Menggunakan request.body tidak akan bekerja karena bodyParser dinonaktifkan
  // Kita perlu mem-parsing FormData secara manual atau menggunakan library
  // Namun, Vercel Blob SDK pintar dan bisa menangani request object langsung
  
  try {
    // 1. Ambil FormData dari request
    const formData = await request.formData();
    const file = formData.get('surat_peminjaman') as File | null;
    const existingFileUrl = formData.get('existing_file') as string | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    // 2. Hapus file lama jika ada
    if (existingFileUrl) {
      try {
        await del(existingFileUrl);
      } catch (delError) {
        // Abaikan error jika file lama tidak ditemukan, mungkin sudah dihapus
        console.warn('Gagal menghapus file lama:', delError);
      }
    }

    // 3. Upload file baru ke Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // 4. Kirim kembali URL file yang berhasil di-upload
    // Format respons disesuaikan dengan yang diharapkan oleh frontend
    return response.status(200).json({ success: 1, file: { url: blob.url } });

  } catch (error) {
    console.error('Upload error:', error);
    return response.status(500).json({ error: 'Terjadi kesalahan saat mengupload file.' });
  }
}

// import { useState } from 'react';

// interface FileUploadProps {
//   onFileUpload: (filePath: string) => void;
//   existingFile?: string;
// }

// export default function FileUpload({ onFileUpload, existingFile }: FileUploadProps) {
//   const [isUploading, setIsUploading] = useState(false);

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validasi type file
//     if (file.type !== 'application/pdf') {
//       alert('Hanya file PDF yang diizinkan');
//       return;
//     }

//     // Validasi size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Ukuran file maksimal 5MB');
//       return;
//     }

//     setIsUploading(true);
    
//     const formData = new FormData();
//     formData.append('surat_peminjaman', file);

//     try {
//       const response = await fetch('/api/upload-surat', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
      
//       if (data.success === 1) {
//         onFileUpload(data.file.url);
//       } else {
//         alert('Gagal mengupload file');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Error uploading file');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="file-upload">
//       <input
//         type="file"
//         accept=".pdf"
//         onChange={handleFileUpload}
//         disabled={isUploading}
//       />
//       {isUploading && <p>Mengupload file...</p>}
//       {existingFile && (
//         <div>
//           <p>File terupload: <a href={existingFile} target="_blank" rel="noopener noreferrer">Lihat Surat</a></p>
//         </div>
//       )}
//     </div>
//   );
// }