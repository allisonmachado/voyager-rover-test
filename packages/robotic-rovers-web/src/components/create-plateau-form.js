"use client";

import { useState } from "react";
import { useForm } from "@/hooks/use-form";
import BaseForm from "./base-form";

export default function CreatePlateauForm() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const { submitForm, ...visualProps } = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();

    submitForm({
      requestPath: `/api/plateaus`,
      requestMethod: "POST",
      requestBody: {
        width,
        height,
      },
      successPath: "/plateaus",
      successMessage: "Plateau created successfully",
    });
  };

  return (
    <BaseForm {...visualProps}>
      <form onSubmit={handleSubmit} className="box">
        <div className="field">
          <label className="label">Width</label>
          <div className="control">
            <input
              className="input"
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              placeholder="Enter width"
              min="0"
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Height</label>
          <div className="control">
            <input
              className="input"
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              placeholder="Enter height"
              min="0"
              required
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-primary">
              Submit
            </button>
          </div>
          <div className="control">
            <button
              type="reset"
              className="button is-light"
              onClick={() => {
                setWidth(0);
                setHeight(0);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </BaseForm>
  );
}
