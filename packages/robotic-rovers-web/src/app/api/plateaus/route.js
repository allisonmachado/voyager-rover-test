import { createPlateau } from "@/data/plateau";

/**
 * Create Plateau Proxy
 */
export async function POST(request) {
  const body = await request.json();

  return createPlateau(body);
}
