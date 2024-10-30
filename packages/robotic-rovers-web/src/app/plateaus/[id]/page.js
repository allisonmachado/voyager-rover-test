import PlateauAndRoversManagers from "@/components/plateau-manager";
import { findPlateauOrRedirect } from "@/data/plateau";
import { listRoversByPlateau } from "@/data/rover";

export default async function PlateauAndRovers({ params }) {
  const plateau = await findPlateauOrRedirect(params.id);
  const rovers = await listRoversByPlateau(params.id);

  return <PlateauAndRoversManagers plateau={plateau} rovers={rovers} />;
}
