// controllers/riwayatPeminjamanController.ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  getAllRiwayatPeminjaman,
  getRiwayatPeminjamanById,
  createRiwayatPeminjaman,
  updateRiwayatPeminjaman,
  deleteRiwayatPeminjaman,
} from "@/models/riwayatPeminjamanModel";

// ✅ Ambil semua riwayat peminjaman
export const fetchAllRiwayatPeminjaman = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await getAllRiwayatPeminjaman();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Ambil riwayat peminjaman berdasarkan ID
export const fetchRiwayatPeminjamanById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "ID riwayat peminjaman wajib disertakan" });

    const data = await getRiwayatPeminjamanById(Number(id));
    if (!data) return res.status(404).json({ message: "Riwayat Peminjaman tidak ditemukan" });
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Buat riwayat peminjaman baru
export const createRiwayatPeminjamanData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body();
    // Validasi minimal id_peminjaman dan catatan bisa ditambahkan jika perlu
    if (!body.id_peminjaman || body.catatan === undefined) {
      return res.status(400).json({ message: "id_peminjaman dan catatan wajib diisi" });
    }

    const insertId = await createRiwayatPeminjaman(body);
    return res.status(201).json({ id: insertId, message: "Riwayat Peminjaman berhasil ditambahkan" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Update riwayat peminjaman
export const updateRiwayatPeminjamanData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, ...data } = await req.body();
    if (!id) return res.status(400).json({ message: "ID riwayat peminjaman wajib disertakan" });
    if (!data.id_peminjaman || data.catatan === undefined) {
      return res.status(400).json({ message: "id_peminjaman dan catatan wajib diisi" });
    }

    await updateRiwayatPeminjaman(Number(id), data);
    return res.status(200).json({ message: "Riwayat Peminjaman berhasil diupdate" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Hapus riwayat peminjaman
export const deleteRiwayatPeminjamanData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = await req.body();
    if (!id) return res.status(400).json({ message: "ID riwayat peminjaman wajib disertakan" });

    await deleteRiwayatPeminjaman(Number(id));
    return res.status(200).json({ message: "Riwayat Peminjaman berhasil dihapus" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
