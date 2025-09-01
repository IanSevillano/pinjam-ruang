// app/api/users/route.ts
import { NextResponse } from 'next/server';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail
} from '../../../models/userModel';



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // If email parameter exists, fetch single user
    if (email) {
      const user = await getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    // Otherwise fetch all users
    const users = await getAllUsers();
    const formattedUsers = users.map(user => ({
      ...user,
      tgl_lahir: user.tgl_lahir
        ? new Date(user.tgl_lahir).toISOString().split('T')[0]
        : null
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

//matiin dulu biar bisa coba profil akun

// GET: Ambil semua user
// export async function GET() {
//   const users = await getAllUsers();

//   // Format tgl_lahir menjadi YYYY-MM-DD
//   const formattedUsers = users.map(user => ({
//     ...user,
//     tgl_lahir: user.tgl_lahir
//       ? new Date(user.tgl_lahir).toISOString().split('T')[0]
//       : null
//   }));

//   return NextResponse.json(formattedUsers);
// }

// POST: Tambah user baru


export async function POST(request: Request) {
  const user = await request.json();

  // Pastikan tgl_lahir dalam format Date
  if (user.tgl_lahir) {
    user.tgl_lahir = new Date(user.tgl_lahir);
  }

  const userId = await createUser(user);
  return NextResponse.json({ id: userId }, { status: 201 });
}

// PUT: Update user
export async function PUT(request: Request) {
  const { id, ...user } = await request.json();

  // Pastikan tgl_lahir dalam format Date
  if (user.tgl_lahir) {
    user.tgl_lahir = new Date(user.tgl_lahir);
  }

  await updateUser(id, user);
  return NextResponse.json({ message: 'User updated successfully' });
}

// DELETE: Soft delete user
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await deleteUser(id);
  return NextResponse.json({ message: 'User deactivated successfully' });
}