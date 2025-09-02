// app/api/hak-akses/[id]/route.ts
import { NextResponse } from "next/server";
import { 
  fetchHakAksesById, 
  updateHakAksesData, 
  deleteHakAksesData 
} from "@/controllers/hakAksesController";

// GET
export async function GET(_req: Request, { params }: any) {
  try {
    const mockReq = { query: { id: params.id } } as any;

    let responseData: any;
    const mockRes: any = {
      status: (code: number) => ({
        json: (data: any) => {
          responseData = data;
          return NextResponse.json(data, { status: code });
        },
      }),
    };

    await fetchHakAksesById(mockReq, mockRes);
    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(req: Request, { params }: any) {
  try {
    const body = await req.json();
    return await updateHakAksesData(
      { query: { id: params.id }, body } as any,
      {
        status: (code: number) => ({
          json: (data: any) => NextResponse.json(data, { status: code }),
        }),
      } as any
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req: Request, { params }: any) {
  try {
    return await deleteHakAksesData(
      { query: { id: params.id } } as any,
      {
        status: (code: number) => ({
          json: (data: any) => NextResponse.json(data, { status: code }),
        }),
      } as any
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// // app/api/hak-akses/[id]/route.ts
// import { NextResponse } from "next/server";
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { 
//   fetchHakAksesById, 
//   updateHakAksesData, 
//   deleteHakAksesData 
// } from "@/controllers/hakAksesController";

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const mockReq = {
//       query: { id: params.id }
//     } as unknown as NextApiRequest;

//     let responseData: any;
//     const mockRes: any = {
//       status: (code: number) => ({
//         json: (data: any) => {
//           responseData = data;
//           return NextResponse.json(data, { status: code });
//         }
//       })
//     };

//     await fetchHakAksesById(mockReq, mockRes);
//     return NextResponse.json(responseData);
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // Fungsi PUT dan DELETE tetap sama...

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await req.json();
//     const res = await updateHakAksesData(
//       { query: { id: params.id }, body } as any,
//       {
//         status: (code: number) => ({
//           json: (data: any) => NextResponse.json(data, { status: code }),
//         }),
//       } as any
//     );
//     return res;
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const res = await deleteHakAksesData(
//       { query: { id: params.id } } as any,
//       {
//         status: (code: number) => ({
//           json: (data: any) => NextResponse.json(data, { status: code }),
//         }),
//       } as any
//     );
//     return res;
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }