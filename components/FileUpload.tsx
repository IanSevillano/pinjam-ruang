//components/FileUpload.tsx
import { useState } from 'react';

interface FileUploadProps {
  onFileUpload: (filePath: string) => void;
  existingFile?: string;
}

export default function FileUpload({ onFileUpload, existingFile }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi type file
    if (file.type !== 'application/pdf') {
      alert('Hanya file PDF yang diizinkan');
      return;
    }

    // Validasi size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('surat_peminjaman', file);
    
    // Kirim informasi file lama jika ada
    if (existingFile) {
      formData.append('existing_file', existingFile);
    }

    try {
      const response = await fetch('/api/upload-surat', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success === 1) {
        onFileUpload(data.file.url);
      } else {
        alert('Gagal mengupload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      {isUploading && <p>Mengupload file...</p>}
      {existingFile && (
        <div>
          <p>File terupload: <a href={existingFile} target="_blank" rel="noopener noreferrer">Lihat Surat</a></p>
        </div>
      )}
    </div>
  );
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