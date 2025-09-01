//controllers/approveUserController.ts
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mailer";

export const approveUser = async (userId: number, adminId: number) => {
  // Ambil user
  const [rows] = await db.query("SELECT * FROM tb_users WHERE id = ?", [userId]);
  const user = (rows as any)[0];
  if (!user) throw new Error("User tidak ditemukan");

  // Buat entry ke tb_hak_akses
  await db.query(
    "INSERT INTO tb_hak_akses (id_user, id_roles) VALUES (?, ?)",
    [user.id, user.requested_role_id]
  );

  // Update user → active + reset requested_role_id
  await db.query(
    `UPDATE tb_users 
     SET is_active = 1, requested_role_id = NULL 
     WHERE id = ?`,
    [user.id]
  );

  // Kirim email verifikasi
  await sendVerificationEmail(user.email, user.token_verifikasi);

  return { message: "User disetujui dan email verifikasi telah dikirim" };
};

export const rejectUser = async (userId: number) => {
  await db.query("DELETE FROM tb_users WHERE id = ?", [userId]);
  return { message: "User ditolak dan dihapus" };
};
