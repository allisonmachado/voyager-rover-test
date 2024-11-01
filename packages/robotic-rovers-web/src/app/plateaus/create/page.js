import CreatePlateauForm from "@/components/create-plateau-form";

export default async function CreatePlateau({ params }) {
  return (
    <div className="container mt-5">
      <div className="box has-background-light p-5">
        <h1 className="title has-text-centered mb-4">Create New Plateau</h1>
        <CreatePlateauForm plateauId={params.id} />
      </div>
    </div>
  );
}
