// controllers/userController.ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  activateUserById,
  User, getUserByEmail
} from "@/models/userModel";


// ✅ Ambil semua user atau user tertentu berdasarkan email
export const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Jika ada parameter email, cari user berdasarkan email
    if (req.query.email) {
      const user = await getUserByEmail(req.query.email as string);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json(user);
    }
    
    // Jika tidak ada parameter, ambil semua user
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
// export const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     const users = await getAllUsers();
//     res.status(200).json(users);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// ✅ Buat user baru
export const createUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const newUser: User = req.body;
    const userId = await createUser(newUser);
    res.status(201).json({ id: userId, message: "User created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update user
export const updateUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = Number(req.query.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

    await updateUser(id, req.body);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Soft delete user
export const deleteUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = Number(req.query.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

    await deleteUser(id);
    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


   // controllers/userController.ts
  export const activateUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
     try {
       const { id } = req.body; // Ambil id dari body permintaan
       if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

       await activateUserById(id); // Gunakan activateUser ById untuk mengaktifkan pengguna
       res.status(200).json({ message: "User  activated successfully" });
     } catch (error: any) {
       res.status(500).json({ error: error.message });
     }
   };
   
   

