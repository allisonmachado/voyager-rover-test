import { createPlateau } from "@/data/plateau";
import { redirect } from "next/navigation";

/**
 * Create Plateau Proxy
 */
export async function POST(request) {
  const body = await request.json();

  return createPlateau(body);
}
