import { deleteRover } from "@/data/rover";

/**
 * Delete Rover Proxy
 */
export async function DELETE(_request, { params }) {
  return deleteRover(params.id);
}
