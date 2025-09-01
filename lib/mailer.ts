// lib/mailer.ts
import nodemailer from "nodemailer";
import { randomBytes } from 'crypto';


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate random token
// export function generateToken(): string {
//   return randomBytes(32).toString('hex');
// }
export function generateToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.APP_URL}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: `"Sistem Peminjaman" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verifikasi Akun Anda",
    html: `
      <h1>Verifikasi Akun</h1>
      <p>Silakan klik link di bawah ini untuk memverifikasi akun Anda:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  });
}





export async function sendPasswordResetEmail(to: string, token: string) {
  await transporter.sendMail({
    from: `"Sistem Peminjaman" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset Password",
    html: `
      <h1>Reset Password</h1>
      <p>Gunakan kode berikut untuk reset password Anda:</p>
      <h2>${token}</h2>
      <p>Kode ini hanya berlaku selama 1 jam.</p>
    `,
  });
}





export async function sendStatusUpdateEmail(
  to: string, 
  nama: string, 
  status: string, 
  peminjamanDetail: any
) {
  const statusLabels: {[key: string]: string} = {
    'menunggu persetujuan': 'Menunggu Persetujuan',
    'disetujui': 'Disetujui',
    'ditolak': 'Ditolak',
    'selesai': 'Selesai',
    'dibatalkan': 'Dibatalkan',
    'expired': 'Kadaluarsa'
  };

  const statusLabel = statusLabels[status] || status;

  await transporter.sendMail({
    from: `"Sistem Peminjaman Ruangan" <${process.env.SMTP_USER}>`,
    to,
    subject: `Status Peminjaman Ruangan: ${statusLabel}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 5px; }
          .content { background-color: #fff; padding: 20px; border-radius: 5px; border: 1px solid #ddd; }
          .detail-item { margin-bottom: 10px; }
          .label { font-weight: bold; }
          .status { 
            display: inline-block; 
            padding: 5px 10px; 
            border-radius: 4px; 
            font-weight: bold; 
            margin: 10px 0;
          }
          .menunggu { background-color: #fff3cd; color: #856404; }
          .disetujui { background-color: #d4edda; color: #155724; }
          .ditolak { background-color: #f8d7da; color: #721c24; }
          .selesai { background-color: #d1ecf1; color: #0c5460; }
          .dibatalkan { background-color: #f8f9fa; color: #6c757d; }
          .expired { background-color: #f8d7da; color: #721c24; }
          .footer { margin-top: 20px; font-size: 12px; color: #6c757d; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sistem Peminjaman Ruangan</h1>
          </div>
          <div class="content">
            <h2>Status Peminjaman Ruangan Telah Diperbarui</h2>
            <p>Halo ${nama},</p>
            <p>Status peminjaman ruangan Anda telah diperbarui:</p>
            
            <div class="status ${status}">${statusLabel}</div>
            
            <h3>Detail Peminjaman:</h3>
            <div class="detail-item"><span class="label">Kegiatan:</span> ${peminjamanDetail.nama_kegiatan || '-'}</div>
            <div class="detail-item"><span class="label">Ruangan:</span> ${peminjamanDetail.nama_ruangan || '-'}</div>
            <div class="detail-item"><span class="label">Gedung:</span> ${peminjamanDetail.nama_gedung || '-'}</div>
            <div class="detail-item"><span class="label">Waktu Mulai:</span> ${formatDisplayDatetime(peminjamanDetail.waktu_peminjaman_mulai)}</div>
            <div class="detail-item"><span class="label">Waktu Selesai:</span> ${formatDisplayDatetime(peminjamanDetail.waktu_peminjaman_selesai)}</div>
            ${peminjamanDetail.surat_peminjaman ? 
              `<div class="detail-item"><span class="label">Surat Peminjaman:</span> ${peminjamanDetail.surat_peminjaman}</div>` : ''}
            
            <p>Silakan login ke sistem untuk melihat informasi lebih lanjut.</p>
          </div>
          <div class="footer">
            <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
            <p>© ${new Date().getFullYear()} Sistem Peminjaman Ruangan. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

// Fungsi helper untuk format tanggal
function formatDisplayDatetime(sqlDatetime?: string | null) {
  if (!sqlDatetime) return "-";
  const d = new Date(sqlDatetime);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}