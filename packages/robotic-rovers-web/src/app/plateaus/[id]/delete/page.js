// path: src/app/plateaus/[id]/delete/page.js
import DeletePlateauForm from "@/components/delete-plateau-form";
import { findPlateauOrRedirect } from "@/data/plateau";

export default async function DeletePlateau({ params }) {
  const plateau = await findPlateauOrRedirect(params.id);

  return (
    <div className="container mt-6">
      <div className="box has-text-centered">
        <h1 className="title is-3 has-text-danger">Delete Plateau</h1>
        <p className="subtitle is-5 mt-3">
          Are you sure you want to delete the <strong>{plateau.name}</strong>?
        </p>
        <DeletePlateauForm plateauId={params.id} />
      </div>
    </div>
  );
}
