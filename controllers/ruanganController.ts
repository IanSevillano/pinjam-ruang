//// controllers/ruanganController.ts
import {
  getAllRuangan,
  getRuanganById,
  createRuangan,
  updateRuangan,
  deleteRuangan
} from '../models/ruanganModel';
import type { NextApiRequest, NextApiResponse } from "next";

// Tipe data untuk Ruangan
interface Ruangan {
  id?: number;
  nama_ruangan: string;
  status_ruangan: string;
  kapasitas: number;
  fasilitas: string;
  id_gedung: number;
}

export async function listRuangan(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getAllRuangan();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function detailRuangan(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "ID tidak valid" });

    const data: Ruangan | null = await getRuanganById(parseInt(id));
    if (!data) return res.status(404).json({ message: "Ruangan tidak ditemukan" });

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function tambahRuangan(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body: Ruangan = req.body;
    const insertId: number = await createRuangan(body);
    return res.status(201).json({ id: insertId, message: "Ruangan berhasil ditambahkan" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function editRuangan(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body: Ruangan = req.body;
    if (!body.id) return res.status(400).json({ message: "ID diperlukan untuk update" });

    const { id, ...data } = body;
    await updateRuangan(id, data);
    return res.status(200).json({ message: "Ruangan berhasil diupdate" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function hapusRuangan(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id }: { id?: number } = req.body;
    if (!id) return res.status(400).json({ message: "ID diperlukan untuk hapus" });

    await deleteRuangan(id);
    return res.status(200).json({ message: "Ruangan berhasil dihapus" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
