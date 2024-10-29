import CreatePlateauForm from "@/components/create-plateau-form";

export default async function CreatePlateau({ params }) {
  return (
    <div className="container">
      <h1 className="title has-text-centered">Create Plateau</h1>
      <CreatePlateauForm plateauId={params.id} />
    </div>
  );
}
