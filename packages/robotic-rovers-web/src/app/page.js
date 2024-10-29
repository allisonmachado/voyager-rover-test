import Link from "next/link";
import { metadata } from "./layout";

export default function Home() {
  return (
    <section className="hero is-info is-fullheight is-align-items-center">
      <div className="hero-body">
        <div className="">
          <p className="title">{metadata.title}</p>
          <p className="subtitle">{metadata.description}</p>

          <Link href="/plateaus">
            <button className="button">Manage Plateaus</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
