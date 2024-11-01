"use client";

export default function BaseForm({
  displayError,
  displayLoading,
  errorMessage,
  children,
}) {
  return (
    <div className="base-form">
      {displayError && (
        <div className="notification is-danger has-text-centered" role="alert">
          {errorMessage}
        </div>
      )}
      {displayLoading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        children
      )}
    </div>
  );
}
