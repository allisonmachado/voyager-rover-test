"use client";
import RoboticRoverForm from "@/components/robotic-rover-form";
import PlateauGrid from "@/components/plateau-grid";
import { useState } from "react";
import DeployRoverForm from "./deploy-rover-form";

export default function PlateauAndRoversManagers({ plateau, rovers }) {
  const [selectedRoverId, setSelectedRoverId] = useState(rovers[0]?.id);

  return (
    <div className="container">
      <section>
        <h1 className="title has-text-centered">
          {plateau.name} ({plateau.xWidth} x {plateau.yHeight})
        </h1>
      </section>

      <section className="has-text-centered legend-section">
        <div className="legend">
          <strong>Legend:</strong>
          <div>N: ↑, E: →, S: ↓, W: ←</div>
        </div>
      </section>

      <section className="grid-section">
        <PlateauGrid
          plateau={plateau}
          rovers={rovers}
          setSelectedRoverId={setSelectedRoverId}
        />
      </section>

      <section className="form-section">
        <RoboticRoverForm roverId={selectedRoverId} />
      </section>

      <section className="form-section">
        <DeployRoverForm plateauId={plateau.id} />
      </section>
    </div>
  );
}
