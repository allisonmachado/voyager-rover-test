"use client";

import { useState } from "react";
import { useForm } from "@/hooks/use-form";
import BaseForm from "./base-form";

export default function RoboticRoverForm({ roverId }) {
  const [instructions, setInstructions] = useState("");
  const [formAction, setFormAction] = useState();

  const { submitForm, ...visualProps } = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formAction === "send-instructions") {
      submitForm({
        requestPath: `/api/robotic-rovers/${roverId}/move-instructions`,
        requestMethod: "POST",
        requestBody: {
          instructions,
        },
        successPath: window.location.href,
        successMessage: "Rover instructions sent successfully!",
      });

      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this rover?"
    );
    if (!confirmDelete) {
      return;
    }

    submitForm({
      requestPath: `/api/robotic-rovers/${roverId}`,
      requestMethod: "DELETE",
      requestBody: {
        instructions,
      },
      successPath: window.location.href,
      successMessage: "Rover removed successfully!",
    });
  };

  const handleInstructionsChange = (e) => {
    const value = e.target.value;

    const validCharacters = /^[RLM]*$/;

    if (validCharacters.test(value)) {
      setInstructions(value);
    }
  };

  return (
    <BaseForm {...visualProps}>
      <form onSubmit={handleSubmit} className="box">
        <h2 className="title is-4">Send Instructions to Rover</h2>
        <div className="field">
          <label className="label">Selected Rover:</label>
          <div className="control">
            <input
              className="input"
              type="number"
              value={roverId}
              placeholder="Enter width"
              min="0"
              required
              disabled
            />
          </div>
        </div>

        <div className="field">
          <label className="label">
            Instructions: <span className="help">(Only R, L, M allowed)</span>
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={instructions}
              onChange={handleInstructionsChange}
              placeholder="Enter instructions"
            />
          </div>
        </div>

        <div className="field is-grouped buttons-section">
          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={() => setFormAction("send-instructions")}
            >
              Move Rover
            </button>
          </div>
          <div className="control">
            <button
              type="submit"
              className="button is-danger"
              onClick={() => setFormAction("remove-rover")}
            >
              Destroy Rover
            </button>
          </div>
        </div>
      </form>
    </BaseForm>
  );
}
