import {
  COMMUNICATION_ERROR_MESSAGE,
  DEFAULT_FORM_ERROR_MESSAGE,
  DEFAULT_FORM_SUCCESS_MESSAGE,
} from "@/utils/constants";
import { useState, useEffect } from "react";
import displaySimpleAlert from "sweetalert";

function extractResponseErrorMessage(response) {
  const message = response.message;

  if (!message) {
    return DEFAULT_FORM_ERROR_MESSAGE;
  }

  if (typeof message === "string") {
    return message;
  }

  return message.join("; ") || DEFAULT_FORM_ERROR_MESSAGE;
}

export function useForm() {
  const [displayError, setDisplayError] = useState(false);
  const [displayLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(DEFAULT_FORM_ERROR_MESSAGE);

  useEffect(() => {
    if (displayLoading) {
      setDisplayError(false);
    }
  }, [displayLoading]);

  const submitForm = async ({
    requestPath,
    requestMethod,
    requestBody,
    successPath,
    successMessage,
    successHandler,
  }) => {
    setLoading(true);
    setDisplayError(false);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      headers: myHeaders,
      method: requestMethod,
      ...(requestBody ? { body: JSON.stringify(requestBody) } : {}),
      redirect: "follow",
    };

    try {
      const response = await fetch(requestPath, requestOptions);

      if (response.redirected) {
        const redirectUrl = response.url;
        return (window.location.href = redirectUrl);
      }

      if (response.status >= 200 && response.status < 300 && successPath) {
        await displaySimpleAlert(
          successMessage ?? DEFAULT_FORM_SUCCESS_MESSAGE
        );

        return (window.location.href = successPath);
      }

      if (response.status >= 200 && response.status < 300) {
        await successHandler(await response.json());
        setDisplayError(false);
        setLoading(false);
        return;
      }

      const result = await response.json();

      setDisplayError(true);
      setErrorMessage(extractResponseErrorMessage(result));
      setLoading(false);
    } catch (error) {
      setDisplayError(true);
      setErrorMessage(COMMUNICATION_ERROR_MESSAGE);
      setLoading(false);
    }
  };

  return {
    displayLoading,
    displayError,
    errorMessage,
    submitForm,
  };
}
