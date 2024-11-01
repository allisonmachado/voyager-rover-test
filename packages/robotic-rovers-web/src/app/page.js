// path: src/app/page.js
import Link from "next/link";
import { metadata } from "./layout";

export default function Home() {
  return (
    <section className="hero is-info is-fullheight is-align-items-center">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title is-1">{metadata.title}</h1>
          <p className="subtitle is-4">{metadata.description}</p>

          <Link href="/plateaus" className="button is-primary is-medium mt-5">
            Manage Plateaus
          </Link>
        </div>
      </div>
    </section>
  );
}
