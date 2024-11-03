// path: src/app/plateaus/page.js
import { listAllPlateaus } from "@/data/plateau";
import Link from "next/link";

export default async function PlateausList() {
  const plateaus = await listAllPlateaus();

  return (
    <div className="container mt-5">
      <h1 className="title has-text-centered mb-6">Plateaus Overview</h1>

      <div className="has-text-centered mb-5">
        <Link href="/plateaus/create" className="button is-primary is-medium">
          + Create New Plateau
        </Link>
      </div>

      {plateaus.length > 0 ? (
        <div className="columns is-multiline">
          {plateaus.map((plateau) => (
            <div className="column is-one-third" key={plateau.id}>
              <div className="card has-background-light">
                <div className="card-content">
                  <p className="title is-5 has-text-info">{plateau.name}</p>
                  <p className="subtitle is-6 has-text-grey">
                    Dimensions: {plateau.xWidth} x {plateau.yHeight}
                  </p>
                  <p className="content">
                    <strong>Area:</strong> {plateau.xWidth * plateau.yHeight}{" "}
                    units
                  </p>
                </div>
                <footer className="card-footer">
                  <Link
                    href={`/plateaus/${plateau.id}`}
                    className="card-footer-item button is-link"
                  >
                    Manage Rovers
                  </Link>
                  <Link
                    href={`/plateaus/${plateau.id}/delete`}
                    className="card-footer-item button is-danger"
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
          <p className="content has-text-grey">
            No plateaus available. Start by creating one!
          </p>
        </div>
      )}
    </div>
  );
}
