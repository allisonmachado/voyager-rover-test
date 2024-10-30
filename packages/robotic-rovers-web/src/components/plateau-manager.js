"use client";
import RoboticRoverForm from "@/components/robotic-rover-form";
import PlateauGrid from "@/components/plateau-grid";
import { useState } from "react";
import DeployRoverForm from "./deploy-rover-form";

export default function PlateauAndRoversManagers({ plateau, rovers }) {
  const [selectedRoverId, setSelectedRoverId] = useState(rovers[0]?.id);

  return (
    <div className="container">
      <h1 className="title has-text-centered">
        {plateau.name} ({plateau.xWidth} x {plateau.yHeight})
      </h1>

      <div className="legend">
        <strong>Legend:</strong>
        <div>N: ↑, E: →, S: ↓, W: ←</div>
      </div>

      <PlateauGrid
        plateau={plateau}
        rovers={rovers}
        setSelectedRoverId={setSelectedRoverId}
      />

      <RoboticRoverForm roverId={selectedRoverId} />
      <DeployRoverForm plateauId={plateau.id} />
    </div>
  );
}
