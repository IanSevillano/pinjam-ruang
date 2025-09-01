// controllers/gedungController.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAllGedung,
  getGedungById,
  createGedung,
  updateGedung,
  deleteGedung,
} from "@/models/gedungModel";

// Tipe data gedung (sesuaikan dengan modelmu)
interface Gedung {
  id?: number;
  nama_gedung: string;
  kode_gedung: string;
  [key: string]: any;
}

export async function fetchAllGedung(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getAllGedung();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function fetchGedungById(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "ID tidak valid" });

    const data: Gedung | null = await getGedungById(parseInt(id));
    if (!data) return res.status(404).json({ message: "Gedung tidak ditemukan" });

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createGedungData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body: Gedung = req.body;
    const insertId: number = await createGedung(body);
    return res.status(201).json({ id: insertId, message: "Gedung berhasil ditambahkan" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateGedungData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body: Gedung = req.body;
    if (!body.id) return res.status(400).json({ message: "ID diperlukan untuk update" });

    const { id, ...data } = body;
    await updateGedung(id, data);
    return res.status(200).json({ message: "Gedung berhasil diupdate" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteGedungData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id }: { id?: number } = req.body;
    if (!id) return res.status(400).json({ message: "ID diperlukan untuk hapus" });

    await deleteGedung(id);
    return res.status(200).json({ message: "Gedung berhasil dihapus" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}