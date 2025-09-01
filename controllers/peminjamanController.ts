// controllers/peminjamanController.ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  getAllPeminjaman,
  getPeminjamanById,
  createPeminjaman,
  updatePeminjaman,
  deletePeminjaman,
  getAllUsers,
  getAllRuangan
} from "@/models/peminjamanModel";

// ✅ Ambil semua peminjaman
export const getPeminjaman = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const peminjaman = await getAllPeminjaman();
    res.status(200).json(peminjaman);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ambil peminjaman berdasarkan ID
export const getPeminjamanDetail = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = Number(req.query.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid peminjaman ID" });

    const peminjaman = await getPeminjamanById(id);
    if (!peminjaman) {
      return res.status(404).json({ error: "Peminjaman not found" });
    }

    res.status(200).json(peminjaman);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ambil semua user untuk dropdown
export const getUsersDropdown = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ambil semua ruangan untuk dropdown
export const getRuanganDropdown = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const ruangan = await getAllRuangan();
    res.status(200).json(ruangan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Buat peminjaman baru
export const createPeminjamanHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = await createPeminjaman(req.body);
    res.status(201).json({ id, message: "Peminjaman created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update peminjaman
export const updatePeminjamanHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = Number(req.query.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid peminjaman ID" });

    await updatePeminjaman(id, req.body);
    res.status(200).json({ message: "Peminjaman updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Hapus peminjaman
export const deletePeminjamanHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = Number(req.query.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid peminjaman ID" });

    await deletePeminjaman(id);
    res.status(200).json({ message: "Peminjaman deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
