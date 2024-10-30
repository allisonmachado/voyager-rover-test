import { createRoboticRover } from "@/data/rover";

/**
 * Deploy Rovers Proxy Proxy
 */
export async function POST(request, { params }) {
  const body = await request.json();

  return createRoboticRover(params.id, body);
}
