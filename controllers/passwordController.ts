//controllers/passwordController.ts
// controllers/passwordController.ts
import { 
  getUserByEmail,
  setPasswordResetToken,
  checkPasswordResetToken,
  resetUserPassword
} from "@/models/userModel";
import { hashPassword } from "@/lib/bycript";
import { generateToken, sendPasswordResetEmail } from "@/lib/mailer";

export const requestPasswordReset = async (email: string) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('Email tidak terdaftar');

  const token = generateToken();
  const expires = new Date(Date.now() + 3600000); // 1 jam

  await setPasswordResetToken(email, token, expires);
  await sendPasswordResetEmail(email, token);

  return { message: 'Kode verifikasi telah dikirim ke email Anda' };
};

export const verifyResetCode = async (email: string, code: string) => {
  const isValid = await checkPasswordResetToken(email, code);
  if (!isValid) throw new Error('Kode verifikasi tidak valid atau sudah kadaluarsa');

  return { success: true, token: code, message: 'Kode verifikasi valid' };
};

export const changePassword = async (email: string, token: string, newPassword: string) => {
  const isValid = await checkPasswordResetToken(email, token);
  if (!isValid) throw new Error('Token tidak valid atau sudah kadaluarsa');

  const hashedPassword = await hashPassword(newPassword);
  await resetUserPassword(email, hashedPassword);

  return { message: 'Password berhasil diubah' };
};
