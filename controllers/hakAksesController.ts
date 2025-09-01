// controllers/hakAksesController.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { 
  getAllHakAkses, 
  getHakAksesById, 
  createHakAkses, 
  updateHakAkses, 
  deleteHakAkses 
} from "@/models/hakAksesModel";

export async function fetchAllHakAkses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getAllHakAkses();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function fetchHakAksesById(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const data = await getHakAksesById(Number(id));
    if (!data) {
      return res.status(404).json({ message: "Hak Akses tidak ditemukan" });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// Fungsi lainnya tetap sama...

export async function createHakAksesData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id_user, id_roles } = req.body;
    if (typeof id_user !== "number" || typeof id_roles !== "number") {
      return res.status(400).json({ message: "id_user dan id_roles wajib diisi dan bertipe number" });
    }

    const insertId: number = await createHakAkses({ id_user, id_roles });
    return res.status(201).json({ id: insertId, message: "Hak Akses berhasil ditambahkan" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function updateHakAksesData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { id_roles } = req.body;
    
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "ID diperlukan untuk update" });
    if (typeof id_roles !== "number") {
      return res.status(400).json({ message: "id_roles wajib diisi dan bertipe number" });
    }

    const updated = await updateHakAkses(Number(id), { id_roles });
    if (!updated) return res.status(404).json({ message: "Hak Akses tidak ditemukan" });
    
    return res.status(200).json({ message: "Hak Akses berhasil diupdate" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function deleteHakAksesData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "ID diperlukan untuk hapus" });

    const deleted = await deleteHakAkses(Number(id));
    if (!deleted) return res.status(404).json({ message: "Hak Akses tidak ditemukan" });

    return res.status(200).json({ message: "Hak Akses berhasil dihapus" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}