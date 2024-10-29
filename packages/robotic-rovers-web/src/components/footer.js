import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          Crafted with dedication by{" "}
          <Link href="https://github.com/allisonmachado">
            Allison Machado Gonçalves.
          </Link>
        </p>
      </div>
    </footer>
  );
}
