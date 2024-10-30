import { sendMoveInstructions } from "@/data/rover";

/**
 * Create Move Instructions Proxy
 */
export async function POST(request, { params }) {
  const body = await request.json();

  return sendMoveInstructions(params.id, body);
}
