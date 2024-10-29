import DeletePlateauForm from "@/components/delete-plateau-form";
import { findPlateauOrRedirect } from "@/data/plateau";

export default async function DeletePlateau({ params }) {
  const plateau = await findPlateauOrRedirect(params.id);

  return (
    <div className="container">
      <h1 className="title has-text-centered">Delete Plateau</h1>
      <p>Are you sure you want to delete the {plateau.name}?</p>
      <DeletePlateauForm plateauId={params.id} />
    </div>
  );
}
