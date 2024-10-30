"use client";

import { useState } from "react";
import { useForm } from "@/hooks/use-form";
import BaseForm from "./base-form";

export default function DeployRoverForm({ plateauId }) {
  const [xCoordinate, setCoordinateX] = useState(0);
  const [yCoordinate, setCoordinateY] = useState(0);
  const [orientation, setOrientation] = useState("N");

  const { submitForm, ...visualProps } = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();

    submitForm({
      requestPath: `/api/plateaus/${plateauId}/robotic-rovers`,
      requestMethod: "POST",
      requestBody: {
        initialPosition: {
          x: xCoordinate,
          y: yCoordinate,
        },
        orientation,
      },
      successPath: window.location.href,
      successMessage: "Robotic Rover Deployed successfully",
    });
  };

  return (
    <BaseForm {...visualProps}>
      <form onSubmit={handleSubmit} className="box">
        <div className="field">
          <label className="label">X Coordinate</label>
          <div className="control">
            <input
              className="input"
              type="number"
              value={xCoordinate}
              onChange={(e) => setCoordinateX(Number(e.target.value))}
              placeholder="Enter X Coordinate"
              min="0"
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Y Coordinate</label>
          <div className="control">
            <input
              className="input"
              type="number"
              value={yCoordinate}
              onChange={(e) => setCoordinateY(Number(e.target.value))}
              placeholder="Enter Y Coordinate"
              min="0"
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Orientation</label>
          <div className="control">
            <div className="select">
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
              >
                <option value="N">North</option>
                <option value="E">East</option>
                <option value="S">South</option>
                <option value="W">West</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-primary">
              Deploy New Rover
            </button>
          </div>
        </div>
      </form>
    </BaseForm>
  );
}
