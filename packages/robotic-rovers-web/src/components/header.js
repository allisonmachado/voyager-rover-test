"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.svg";
import { useState } from "react";

export default function Header() {
  const [isActive, setIsActive] = useState(false);

  const toggleIsActive = () => {
    setIsActive(!isActive);
  };

  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <Image src={logo} alt="Plateau" width={112} height={112} />
          </a>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded={isActive}
            onClick={toggleIsActive}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
          <div className="navbar-start">
            <Link className="navbar-item" href="/">
              Home
            </Link>

            <Link className="navbar-item" href="/plateaus">
              Plateaus
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
