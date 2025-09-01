// controllers/rolesController.ts
import {
  getAllRoles,
  getRoleById as getRoleByIdModel,
  createRole as createRoleModel,
  updateRole as updateRoleModel,
  deleteRole as deleteRoleModel,
} from "@/models/rolesModel";

// --- Type ---
export interface Role {
  id?: number;
  nama_role: string;
}

// --- Controller Functions ---

// GET semua role
export async function listRoles(): Promise<Role[]> {
  return (await getAllRoles()) as Role[];
}

// GET role by ID
export async function getRoleByIdController(id: number): Promise<Role | null> {
  const role = await getRoleByIdModel(id);
  return role ?? null;
}

// POST tambah role
export async function addRole(data: { nama_role: string }): Promise<{ id: number; nama_role: string }> {
  if (!data.nama_role) throw new Error("Nama role wajib diisi");
  return await createRoleModel(data.nama_role);
}

// PUT update role
export async function editRole(id: number, data: { nama_role: string }): Promise<{ id: number; nama_role: string }> {
  if (!data.nama_role) throw new Error("Nama role wajib diisi");
  return await updateRoleModel(id, data.nama_role);
}

// DELETE role
export async function removeRole(id: number): Promise<void> {
  await deleteRoleModel(id);
}