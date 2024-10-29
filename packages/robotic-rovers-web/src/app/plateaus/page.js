import { listAllPlateaus } from "@/data/plateau";
import Link from "next/link";

export default async function PlateausList() {
  const plateaus = await listAllPlateaus();

  return (
    <div className="container">
      <h1 className="title has-text-centered">Plateaus Overview</h1>

      <div className="has-text-centered mb-4">
        <Link href="/plateaus/create" className="button is-primary">
          Create New Plateau
        </Link>
      </div>

      {plateaus.length > 0 ? (
        <div className="columns is-multiline">
          {plateaus.map((plateau) => (
            <div className="column is-one-third" key={plateau.id}>
              <div className="card">
                <div className="card-content">
                  <p className="title is-4">{plateau.name}</p>
                  <p className="subtitle is-6">
                    Dimensions: {plateau.xWidth} x {plateau.yHeight}
                  </p>
                  <p className="content">
                    <strong>Area:</strong> {plateau.xWidth * plateau.yHeight}{" "}
                    units
                  </p>
                </div>
                <footer className="card-footer">
                  <Link
                    className="card-footer-item button is-secondary"
                    type="button"
                    href={`/plateaus/${plateau.id}`}
                  >
                    Manage Rovers
                  </Link>
                  <Link
                    className="card-footer-item button is-danger is-light"
                    type="button"
                    href={`/plateaus/${plateau.id}/delete`}
                  >
                    Delete Plateau
                  </Link>
                </footer>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="has-text-centered">
          <p className="content">
            No plateaus available. Start by creating one!
          </p>
        </div>
      )}
    </div>
  );
}
