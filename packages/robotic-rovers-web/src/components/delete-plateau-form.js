"use client";

import { useForm } from "@/hooks/use-form";
import BaseForm from "./base-form";

export default function DeletePlateauForm(props) {
  const { plateauId } = props;
  const { submitForm, ...visualProps } = useForm();

  return (
    <BaseForm {...visualProps}>
      <div className="field is-grouped">
        <p className="control">
          <button
            type="button"
            className="button is-danger"
            onClick={() =>
              submitForm({
                requestPath: `/api/plateaus/${plateauId}`,
                requestMethod: "DELETE",
                successPath: "/plateaus",
                successMessage: "Plateau deleted successfully",
              })
            }
          >
            Yes, Delete
          </button>
        </p>
        <p className="control">
          <button
            type="button"
            className="button is-light"
            onClick={() => history.back()}
          >
            Cancel
          </button>
        </p>
      </div>
    </BaseForm>
  );
}
