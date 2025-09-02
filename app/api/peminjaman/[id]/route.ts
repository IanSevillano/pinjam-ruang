// app/api/peminjaman/[id]/route.ts
import { NextResponse } from "next/server";
import {
  getPeminjamanById,
  updatePeminjaman,
  deletePeminjaman,
} from "../../../../models/peminjamanModel";

// ============================
// GET BY ID
// ============================
export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const peminjamanId = Number(params.id);

    if (isNaN(peminjamanId)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const peminjaman = await getPeminjamanById(peminjamanId);
    if (!peminjaman) {
      return NextResponse.json(
        { success: false, message: "Peminjaman tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, peminjaman });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ============================
// UPDATE
// ============================
export async function PUT(
  request: Request,
  { params }: any
) {
  try {
    const peminjamanId = Number(params.id);

    if (isNaN(peminjamanId)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    await updatePeminjaman(peminjamanId, body);

    return NextResponse.json({ success: true, id: peminjamanId });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}

// ============================
// DELETE
// ============================
export async function DELETE(
  request: Request,
  { params }: any
) {
  try {
    const peminjamanId = Number(params.id);

    if (isNaN(peminjamanId)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    await deletePeminjaman(peminjamanId);
    return NextResponse.json({ success: true, id: peminjamanId });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
// //app/api/peminjaman/[id]/route.ts
// import { NextResponse } from "next/server";
// import {
//   getPeminjamanById,
//   updatePeminjaman,
//   deletePeminjaman,
// } from "../../../../models/peminjamanModel";

// // ============================
// // GET BY ID
// // ============================
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const peminjamanId = Number(id);
    
//     if (isNaN(peminjamanId)) {
//       return NextResponse.json(
//         { success: false, message: "ID tidak valid" },
//         { status: 400 }
//       );
//     }

//     const peminjaman = await getPeminjamanById(peminjamanId);
//     if (!peminjaman) {
//       return NextResponse.json(
//         { success: false, message: "Peminjaman tidak ditemukan" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, peminjaman });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }

// // ============================
// // UPDATE
// // ============================
// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const peminjamanId = Number(id);
    
//     if (isNaN(peminjamanId)) {
//       return NextResponse.json(
//         { success: false, message: "ID tidak valid" },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();
//     await updatePeminjaman(peminjamanId, body);

//     return NextResponse.json({ success: true, id: peminjamanId });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 400 }
//     );
//   }
// }

// // ============================
// // DELETE
// // ============================
// export async function DELETE(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const peminjamanId = Number(id);
    
//     if (isNaN(peminjamanId)) {
//       return NextResponse.json(
//         { success: false, message: "ID tidak valid" },
//         { status: 400 }
//       );
//     }

//     await deletePeminjaman(peminjamanId);
//     return NextResponse.json({ success: true, id: peminjamanId });
//   } catch (err: any) {
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }