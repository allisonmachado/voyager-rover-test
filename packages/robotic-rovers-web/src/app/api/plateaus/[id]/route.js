import { deletePlateau } from "@/data/plateau";

/**
 * Delete Habit Proxy
 */
export async function DELETE(_request, { params }) {
  return deletePlateau(params.id);
}
