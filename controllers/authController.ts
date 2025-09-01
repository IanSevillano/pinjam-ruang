// controllers/authController.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail, activateUser, User } from "@/models/userModel";
import { sendVerificationEmail } from "@/lib/mailer";

// export const register = async (data: User) => {
//   const existingUser = await getUserByEmail(data.email);
//   if (existingUser) throw new Error("Email sudah terdaftar");

//   const hashedPassword = await bcrypt.hash(data.password, 10);
//   const verificationToken = Math.random().toString(36).substring(2, 15);

//   const newUserId = await createUser({
//     ...data,
//     password: hashedPassword,
//     token_verifikasi: verificationToken,
//     is_verified: 0,
//     is_active: 1,
//   });

//   // Kirim email verifikasi
//   await sendVerificationEmail(data.email, verificationToken);

//   return { message: "Registrasi berhasil, cek email untuk verifikasi", userId: newUserId };
// };


export const register = async (data: User) => {
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) throw new Error("Email sudah terdaftar");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const verificationToken = Math.random().toString(36).substring(2, 15);

  const newUserId = await createUser({
    ...data,
    password: hashedPassword,
    token_verifikasi: verificationToken,
    is_verified: 0,
    is_active: 0, // default pending
  });

  // ❌ Jangan langsung kirim email di sini
  return { 
    message: "Registrasi berhasil, menunggu approval admin",
    userId: newUserId 
  };
};



export const verifyAccount = async (token: string) => {
  const success = await activateUser(token);
  if (!success) throw new Error("Token tidak valid atau sudah digunakan");
  return { message: "Verifikasi berhasil, silakan login" };
};

export const login = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("Email tidak ditemukan");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password salah");

  if (!user.is_active) throw new Error("Akun nonaktif");
  if (!user.is_verified) throw new Error("Akun belum diverifikasi");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return { token, user };

};


