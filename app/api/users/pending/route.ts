//app/api/users/pending/route.ts
// app/api/users/pending/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 
         u.id, 
         u.email, 
         u.username, 
         u.nama_lengkap, 
         u.jenis_kelamin, 
         u.id_pengenal, 
         u.requested_role_id,
         r.nama_role AS requested_role_name
       FROM tb_users u
       LEFT JOIN tb_roles r ON u.requested_role_id = r.id
       WHERE u.is_active = 0`
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error fetching pending users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import db from "@/lib/db";
// import { RowDataPacket } from "mysql2";

// export async function GET() {
//   try {
//     const [rows] = await db.query<RowDataPacket[]>(
//       "SELECT id, email, username, nama_lengkap, jenis_kelamin, id_pengenal, requested_role_id FROM tb_users WHERE is_active = 0"
//     );
//     return NextResponse.json(rows);
//   } catch (error: any) {
//     console.error("Error fetching pending users:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
