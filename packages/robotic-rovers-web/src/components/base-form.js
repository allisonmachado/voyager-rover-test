"use client";

export default function BaseForm({
  displayError,
  displayLoading,
  errorMessage,
  children,
}) {
  return (
    <>
      {displayError && (
        <div className="alert alert-warning" role="alert">
          {errorMessage}
        </div>
      )}
      {displayLoading ? <p>Loading...</p> : children}
    </>
  );
}
